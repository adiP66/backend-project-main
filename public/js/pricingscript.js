const basicplanbtn = document.getElementById('basicplan');
const premiumplanbtn = document.getElementById('premiumplan')



basicplanbtn.addEventListener('click', async(event) => {
    const response = await fetch('/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 500 , basic: 'basicplan', }) // Rs.500
    });

    
    const responseJson = await response.json();

    if(responseJson.message === 'Please provide amount'){
        alert('Please provide amount')
    }

    if(responseJson.message === 'Login First!'){
        alert('You have to login first!');
    }

    if(responseJson.message === 'You already have an existing plan'){
        alert('You already have a pending plan')
    }

    

    const { order } = responseJson;

    const razorPayOptions = {
        key: 'rzp_test_Ri6c9gykHzsaxT',
        amount: 500,
        currency: 'INR',
        name: `Buy Basic plan`,
        description: `Paying for testing`,
        order_id: order.id,
        handler: function (response) { // handler function when payment is successfull
            const razorpayPaymentId = response['razorpay_payment_id'];
            const razorpayOrderId = response['razorpay_order_id'];
            const razorpaySignature = response['razorpay_signature'];
            console.log('Payment successfull');
            window.location.href = `http://localhost:3000/check-order-status/${razorpayOrderId}`;
        },
    };

    const razorpayInstance = new Razorpay(razorPayOptions);
    razorpayInstance.open();



})


premiumplanbtn.addEventListener('click', async(event) => {
    const response = await fetch('/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 1000, premium: 'premiumplan', }) // Rs.1000
    });

    
    const responseJson = await response.json();

    if(responseJson.message === 'Please provide amount'){
        alert('Please provide amount')
    }

    if(responseJson.message === 'Login First!'){
        alert('You have to login first!');
    }

    if(responseJson.message === 'You already have an existing plan'){
        alert('You already have a pending plan')
    }



    const { order } = responseJson;

    const razorPayOptions = {
        key: 'rzp_test_Ri6c9gykHzsaxT',
        amount: 1000,
        currency: 'INR',
        name: `Buy Premium plan`,
        description: `Paying for testing`,
        order_id: order.id,
        handler: function (response) { // handler function when payment is successfull
            const razorpayPaymentId = response['razorpay_payment_id'];
            const razorpayOrderId = response['razorpay_order_id'];
            const razorpaySignature = response['razorpay_signature'];
            console.log('Payment successfull');
            window.location.href = `http://localhost:3000/check-order-status/${razorpayOrderId}`;
        },
    };

    const razorpayInstance = new Razorpay(razorPayOptions);
    razorpayInstance.open();



})