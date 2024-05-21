(async () => {
    try {
        const response = await axios.get('/premium-status');
        const data = await response.data;

        if (data.premium) {
            document.getElementById('buy-premium').style.display = 'none';
            document.getElementById('prime').setAttribute('class', 'text-warning');
        }
        else
            document.getElementById('buy-premium').setAttribute('class', 'btn btn-sm btn-outline-warning d-block');

    } catch (error) {
        console.log(error);
    }
})();

function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
}

const username = getCookieValue('username');

if (username)
    document.getElementById('username').innerText = username;

document.getElementById('buy-premium').addEventListener('click', async (e) => {
    try {
        const response = await axios.post('/create-order');
        const order = await response.data;

        const options = {
            key: 'rzp_test_FIFPO5GC78zjhW',
            amount: order.amount,
            currency: 'INR',
            name: 'E-Tracker',
            description: 'Payment for Upgrading To Premium',
            order_id: order.id,
            handler: async function (response) {
                const result = await axios.post('/upgarde-user', { orderId: response.razorpay_order_id, premium: true }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = result.data;

                if (data) {
                    document.getElementById('buy-premium').setAttribute('class', 'd-none')
                    document.getElementById('prime').setAttribute('class', 'text-warning');
                }
                else
                document.getElementById('buy-premium').setAttribute('class', 'btn btn-sm btn-outline-warning d-block');
            },
            profile: {
                name: username,
                email: 'example@try.com',
                contact: '1234567890'
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

    } catch (error) {
        console.log(error);
    }
});


