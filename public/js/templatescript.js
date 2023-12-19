$(document).ready(function () {
  $(".live-demo-button").click(function () {
    var demoUrl = $(this).data("demo-url");
    $("#demoIframe").attr("src", demoUrl);
  });
});

function disableHover() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.classList.add("no-hover");
  });
}

function enableHover() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.classList.remove("no-hover");
  });
}

document.querySelectorAll(".temppayment-btn").forEach((button) => {
  button.addEventListener("click", async function (event) {
    const templatePrice = button.dataset.price;
    const templateName = button.dataset.name;

    console.log(templateName);

    if (templatePrice == 0) {
      if (templateName.includes("PPT")) {
        let firstWord = templateName.trim().split(" ")[0];
        window.location.href = `http://localhost:3000/templates/PPTdownload-file/${firstWord}`;
      } else {
        window.location.href = `http://localhost:3000/templates/download-file/${templateName}`;
      }
    }

    if (templatePrice > 0) {
      console.log(templatePrice);
      const response = await fetch("/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: templatePrice, basic: "Buy Template" }),
      });

      const responseJson = await response.json();

      if (responseJson.message === "Please login first!") {
        alert("Please login first!");
      }

      const { order } = responseJson;

      const razorPayOptions = {
        key: "rzp_test_Ri6c9gykHzsaxT",
        amount: templatePrice,
        currency: "INR",
        name: `Buy ${templateName} Template`,
        description: `Paying for testing`,
        order_id: order.id,
        handler: function (response) {
          // handler function when payment is successfull
          const razorpayPaymentId = response["razorpay_payment_id"];
          const razorpayOrderId = response["razorpay_order_id"];
          const razorpaySignature = response["razorpay_signature"];
          console.log("Payment successfull");
          window.location.href = `http://localhost:3000/templates/check-temporder-status/${templateName}`;
        },
      };

      const razorpayInstance = new Razorpay(razorPayOptions);
      razorpayInstance.open();
    }
    // Now you can use templatePrice in your createOrder function
  });
});
