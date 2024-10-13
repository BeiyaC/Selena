const buyFormButton = document.getElementsByClassName('buyForm');

for (button of buyFormButton) {
    button.addEventListener('click', () => {
        loadingAlert('Merci de votre confiance');
    })
}

function loadingAlert(message) {
    return Swal.fire({
        title: message,
        html: 'Laissez-nous votre mail pour être informé de la sortie de notre produit',
        backdrop: `
            rgba(0,0,123,0.4)
            url("https://sweetalert2.github.io/images/nyan-cat.gif")
            left top
            no-repeat
        `,
        input: 'email',
        showCancelButton: true,
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Soumettre',
        showLoaderOnConfirm: true,
        preConfirm: async (email) => {
            try {
                const response = await create_user_mutation(email);

                if (response === "EMAIL_ERROR") {
                    throw new Error("Email déjà utilisé");
                } else if (response.createUser.status === "ok") {
                    return response;
                }
            } catch (error) {
                Swal.showValidationMessage(`
                    Request failed: ${error}
                `);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "C'est noté !", text: "Nous reviendrons vers vous trés vite.", icon: "success"
            });
        }
    });
}


async function create_user_mutation(email) {
    let results = await fetch('https://pizzafist-api.onrender.com/v2/authentication/graphql/', {
        method: 'POST',

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query:
                `mutation createUser($email: String!) {
                    createUser(email: $email) {
                       status
                    }
                }`,
            operationName: "createUser",
            variables: {
                "email": email,
            }
        })
    })

    let result = await results.json();

    if (result.data !== null) {
        return result.data
    } else {
        return "EMAIL_ERROR"
    }
}