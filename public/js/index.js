if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
}
// Ticket controller 
const deleteItem = (id) => {
    const csrfToken = document.querySelector('#csrf').value;
    id = parseInt(id);
    

    fetch('http://localhost:4000/delete-item', {
        method: 'POST',
        body: JSON.stringify({id}),
        headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        },
    })
    .then(res => {
        location.reload();
        return false;   // stop form from submitting on page refresh 
    })
    .catch(err => console.log(err));
}



// Cart controller 
const postCheckout = () => {
    const details = [];
    const address = [];
    const csrfToken = document.querySelector('#csrf').value;    

    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const townCity = document.getElementById('townCity').value;
    const county = document.getElementById('county').value;
    const postalCode = document.getElementById('postalCode').value;

    details.push(firstName, lastName, email);
    address.push(address1, address2, townCity, county, postalCode);

    let checkoutObj = {};
    checkoutObj.details = details;
    checkoutObj.address = address;

    fetch('http://localhost:4000/cart-checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(checkoutObj)
    })
    .then(res => {
        console.log('done');
    })
    .catch(err => {
        console.log(err);
    })
};


const modal = document.querySelector(".modal");

function toggleModal() {
    modal.classList.toggle("show-modal");

}

function windowOnClick(event) { // when the dark background of the modal is clicked - hide the modal again 
    if (event.target === modal) {
        toggleModal();
    }
}

document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'close-button'){
        toggleModal();
     }
 });
window.addEventListener("click", windowOnClick);



