let accounts = JSON.parse(localStorage.getItem("accounts")) || [{"firstName":"Nishi","lastName":"Paul","accno":1001,"depositAmount":1000,"history":[{"type":"CREATE","amount":1000,"date":"9/18/2024, 12:45:30 PM"}]},{"firstName":"Bishwoup","lastName":"Mollik","accno":1002,"depositAmount":1000,"history":[{"type":"CREATE","amount":1000,"date":"9/18/2024, 12:45:44 PM"}]},{"firstName":"SM","lastName":"Tanjim","accno":1003,"depositAmount":1000,"history":[{"type":"CREATE","amount":1000,"date":"9/18/2024, 12:46:39 PM"}]}];
let accno = JSON.parse(localStorage.getItem("accno")) || 1003;
// localStorage.clear();
console.log(accounts);
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createAccount() {
   let fname = document.getElementById("fname").value.trim();
   let lname = document.getElementById("lname").value.trim();
  const depAmount = parseFloat(
    document.getElementById("depAmount").value.trim()
  );

  if (!fname || !lname || isNaN(depAmount) || depAmount <= 0) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // Check if account already exists
  fname= capitalizeFirstLetter(fname);
  lname= capitalizeFirstLetter(lname);

  const existingAccount = accounts.find(
    (account) => account.firstName === fname && account.lastName === lname
  );
  if (existingAccount) {
    alert("Account already exists.");
    return;
  }

  const history1 = {
    type: "CREATE",
    amount: depAmount,
    date: new Date().toLocaleString(),
  };
 
  const newAccount = {
    firstName: fname,
    lastName: lname,
    accno: ++accno,
    depositAmount: depAmount,
    history: [history1],
  };

  accounts.push(newAccount);

  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("accno", accno);

  document.getElementById("fname").value = "";
  document.getElementById("lname").value = "";
  document.getElementById("depAmount").value = "";

  alert(`Account created successfully! Your account number is ${accno} . Don't forget it for future transactions.`);

  displayAccounts();
}

function displayAccounts() {
  const accountsListDiv = document.getElementById("accounts-list");

  accountsListDiv.innerHTML = "";

  // generate hmtl for each account
  accounts.forEach((account, index) => {
    const accountDiv = document.createElement("div");
    accountDiv.className = "account";

    accountDiv.innerHTML = `
                <p>${account.firstName} ${account.lastName}</p>
                <p>Account ${account.accno}</p>
                <p>$${account.depositAmount.toFixed(2)}</p>
                <div>
                    <button onclick="deleteAccount(${index})">Delete</button>
                    <button onclick="viewTransactionHistory(${index})">Transaction History</button>
                </div>
            `;

    accountsListDiv.appendChild(accountDiv);
  });
}

function deleteAccount(index) {
  accounts.splice(index, 1);

  // Update local storage
  localStorage.setItem("accounts", JSON.stringify(accounts));

  // Refresh account list
  displayAccounts();
}

// function viewTransactionHistory(index) {
//   alert(`Transaction History for Account ${index + 1} (not implemented)`);
// }

displayAccounts();

// for depositAmount/////////////////////////////////////////

function deposit() {
  // console.log("deposit");
  const accnoD = document.getElementById("acccno").value.trim();
  const depAmount = parseFloat(
    document.getElementById("depAmount").value.trim()
  );
  const existingAccount = accounts.find((account) => account.accno == accnoD);

  document.getElementById("acccno").value="";
  document.getElementById("depAmount").value="";

  if (!existingAccount || isNaN(depAmount) || depAmount <= 0) {
    alert("Please fill in all fields correctly.");
    return;
  }
  const history1 = {
    type: "deposit",
    amount: depAmount,
    date: new Date().toLocaleString(),
  };

  existingAccount.depositAmount += depAmount;
  existingAccount.history.push(history1);
   alert(`Deposited ${depAmount} to Account ${existingAccount.accno}. New balance is ${existingAccount.depositAmount}.`);

  console.log(accnoD, depAmount, accounts, existingAccount);
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

/////////////////////////for withdrawAmount/////////////////////////////////////////

function withdraw() {
  console.log("withdraw");
  const accnoD = document.getElementById("acccno").value.trim();
  
  const depAmount = parseFloat(
    document.getElementById("depAmount").value.trim()
  );

  document.getElementById("acccno").value="";
  document.getElementById("depAmount").value="";

  const existingAccount = accounts.find((account) => account.accno == accnoD);

  if (!existingAccount || isNaN(depAmount) || depAmount <= 0) {
    alert("Please fill in all fields correctly.");
    return;
  }
  const history1 = {
    type: "withdraw",
    amount: depAmount,
    date: new Date().toLocaleString(),
  };

  existingAccount.depositAmount -= depAmount;
  existingAccount.history.push(history1);
  alert(
    `Withdraw ${depAmount} to Account ${existingAccount.accno}. New balance is ${existingAccount.depositAmount}.`
  );

  // console.log(accnoD,depAmount,accounts,existingAccount);
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

/////////////////////////for transferAmount/////////////////////////////////////////

function transfer() {
  console.log("transfer");

  const senderAccNo = document.getElementById("sender").value.trim();
  const receiverAccNo = document.getElementById("receiver").value.trim();
  const transferAmount = parseFloat(
    document.getElementById("transferAmount").value.trim()
  );

  document.getElementById("sender").value = "";
  document.getElementById("receiver").value = "";
  document.getElementById("transferAmount").value = "";

  // Find sender and receiver accounts
  const senderAccount = accounts.find(
    (account) => account.accno == senderAccNo
  );
  const receiverAccount = accounts.find(
    (account) => account.accno == receiverAccNo
  );

  //check validate input
  if (
    !senderAccount ||
    !receiverAccount ||
    isNaN(transferAmount) ||
    transferAmount <= 0 ||
    senderAccount.depositAmount < transferAmount
    || senderAccNo === receiverAccNo
  ) {
    alert("Please fill in all fields correctly and ensure sufficient balance.");
    return;
  }

  // reduse amount from sender
  senderAccount.depositAmount -= transferAmount;
  let seText=`Transfer Sent to ${receiverAccNo}`;
  let reText=`Transfer Received from ${senderAccNo}`;
  senderAccount.history.push({
    type: seText,
    amount: transferAmount,
    date: new Date().toLocaleString(),
  });

  // Add amount to receiver
  receiverAccount.depositAmount += transferAmount;
  receiverAccount.history.push({
    type: reText,
    amount: transferAmount,
    date: new Date().toLocaleString(),
  });

  // console.log(senderAccNo, receiverAccNo, transferAmount, accounts);
  localStorage.setItem("accounts", JSON.stringify(accounts));

  alert(
    `Transferred ${transferAmount} from Account ${senderAccNo} to Account ${receiverAccNo}.`
  );
}

///////////////////////////history///////////////////////

function viewTransactionHistory(index) {
  localStorage.setItem("accountIndex", index);
  window.location.href = "transactionHistory.html";
}

function loadTransactionHistory() {
  const accountIndex = localStorage.getItem("accountIndex");
  console.log("refresh " + accountIndex);

  if (accountIndex === null) {
    alert("No account selected for viewing transaction history.");
    return;
  }

  const account = accounts[accountIndex];
  if (!account) {
    alert("Account not found.");
    return;
  }

  // Display account details
  const accountDetailsDiv = document.getElementById("account-details");
  accountDetailsDiv.innerHTML = `
            <h1>Account Details</h1>
            <p> Name : <b>${account.firstName} ${account.lastName} </b></p>
            <p>Account No: <b>${account.accno}</b></p>
            <p>Balance: <b>$${account.depositAmount.toFixed(2)}</b></p>
        `;

  // Display transaction history
  const historyListDiv = document.getElementById("history-list");
  const historyTableBody = document.querySelector("#history-table tbody");
  historyTableBody.innerHTML = ""; // Clear any previous history

  account.history.forEach((entry) => {
    const historyEntryRow = document.createElement("tr");
    historyEntryRow.innerHTML = `
        <td>${entry.type}</td>
        <td>$${entry.amount.toFixed(2)}</td>
        <td>${entry.date}</td>
    `;
    historyTableBody.appendChild(historyEntryRow);
  });
}
