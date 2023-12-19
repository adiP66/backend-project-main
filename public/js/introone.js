document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('onboarding-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const purpose = document.getElementById('purpose').value;
        const topics = Array.from(document.getElementById('topics').selectedOptions).map(option => option.value);

        // You can handle the collected data here (e.g., send it to a server).
        // For this example, we'll display an alert with the collected information.
        alert(`Thank you! Your purpose is ${purpose} and your selected topics are: ${topics.join(', ')}`);

        // You can also redirect the user to another page after submitting the form.
        // window.location.href = '/next-page.html';
    });
});
