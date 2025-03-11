
document.getElementById('signUp').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('nameID').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    const result = await response.text();
    alert(result);
});

document.getElementById('SigninBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (result.token) {
        alert('Login successful');
        // window.location.href = '/to-doList.html'; 
        window.location.href = '/views/to-doList.html'
    } else {
        alert(result);
    }
});
