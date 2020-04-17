(function() {
  const pElement = document.createElement('p');
  pElement.innerText = '0';

  const buttonElement = document.createElement('button');
  buttonElement.innerText = 'Click me!';

  let counter = 0;
  buttonElement.addEventListener('click', () => {
    counter++;

    pElement.innerText = 'Loading...';
    buttonElement.disabled = true;

    fetch(`https://jsonplaceholder.typicode.com/todos/${counter}`, { cache: 'force-cache' })
      .then(response =>
        response.json().then(data => {
          pElement.innerText = data.title;
        })
      )
      .catch(console.error)
      .then(() => {
        buttonElement.disabled = false;
      });
  });

  const containerDivElement = document.createElement('div');
  containerDivElement.appendChild(buttonElement);
  containerDivElement.appendChild(pElement);
  document.body.appendChild(containerDivElement);
})();
