let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

let save = () => {
  localStorage.setItem('accounts', JSON.stringify(accounts));
};
let editIndex = -1;

let addTable = () => {
  let accTable = document.getElementById('account-list');
  accTable.innerHTML = '';

  if (accounts.length === 0) {
    let noRec = document.createElement('tr');
    noRec.innerHTML = `
                    <td colspan="4" class="text-center bg-danger-subtle fw-bold fs-5">No Records</td>
                `;

    accTable.append(noRec);
    return;
  }

  for (let i = 0; i < accounts.length; i++) {
    let account = accounts[i];
    let Row = document.createElement('tr');

    Row.innerHTML = `
                <td>${i + 1}</td>
                <td>${account.email}</td>
                <td>${account.password}</td>
                <td>
                    <button class="btn btn-md btn-warning mt-2 edit"><ion-icon name="create-outline"></ion-icon></button>
                    <button class="btn btn-md btn-danger mt-2 delete"><ion-icon name="trash-outline"></ion-icon></button> 
                </td>
            `;
    Row.querySelector('.edit').addEventListener('click', function () {
      document.getElementById('email').value = account.email;
      document.getElementById('password').value = account.password;
      editIndex = [i];
    });

    Row.querySelector('.delete').addEventListener('click', function () {
      accounts.splice(i, 1);
      showAlert('Account Deleted', 'danger');
      save();
      addTable();
    });

    accTable.append(Row);
  }
};
addTable();

document.getElementById('account-form').addEventListener('submit', function (e) {
  e.preventDefault();

  let email = document.getElementById('email').value.trim();
  let password = document.getElementById('password').value.trim();

  function validatePassword(email, password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!email || !password) {
      showAlert('Please fill all fields!', 'danger');
      return;
    }

    if (password.length < 8) {
      showAlert('Password must be at least 8 characters long', 'danger');
      return;
    }

    if (!hasUpperCase || !hasNumber || !hasSymbol) {
      showAlert('Password must include uppercase letters, numbers, and symbols', 'danger');
      return;
    }

    return true;
  }

  if (!validatePassword(email, password)) {
    return;
  }
  showAlert('Account added successfully', 'success');

  let account = {
    email: email,
    password: password,
  };

  if (editIndex === -1) {
    accounts.push(account);
  } else {
    accounts[editIndex] = account;
    showAlert('Edited Successfully', 'success');
    editIndex = -1;
  }

  save();
  addTable();

  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
});

function showAlert(message, type) {
  let alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert alert-${type}`;
  alert.classList.remove('d-none');

  setTimeout(function () {
    alert.classList.add('d-none');
  }, 1700);
}

document.getElementById('deleteAll').addEventListener('click', function () {
  let cnfrm = confirm('are you sure you want to delete all records');
  if (cnfrm) {
    accounts = [];
    save();
    addTable();
  }
});
