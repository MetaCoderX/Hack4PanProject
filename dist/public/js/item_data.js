function previewBtnClicked(id) {
     const data = {'id': id};
     const options = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json'},
         body: JSON.stringify(data),
         status: 200,
     }

     fetch('/preview', options)
     .then(res => {
         const itemDetails = res.json();
         return itemDetails;
         // console.log(res);
     })
     .then(res => {
         console.log(res[0]);
         window.location.href = '/preview';
         // console.log(itemDetails.id);
     })
     .catch(err => {
         console.log(err);
     })
}
