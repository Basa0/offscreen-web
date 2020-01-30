(function() {
  const divElement = document.createElement('div');
  divElement.innerText = '0';

  const buttonElement = document.createElement('button');
  buttonElement.innerText = 'Click me!';

  let counter = 0;
  buttonElement.addEventListener('click', () => {
    counter++;

    divElement.innerText = 'Loading...';
    buttonElement.disabled = true;

    fetch(`https://jsonplaceholder.typicode.com/todos/${counter}`, { cache: 'force-cache' })
      .then(response =>
        response.json().then(data => {
          divElement.innerText = data.title;
        })
      )
      .catch(console.error)
      .then(() => {
        buttonElement.disabled = false;
      });
  });

  const containerDivElement = document.createElement('div');
  containerDivElement.appendChild(buttonElement);
  containerDivElement.appendChild(divElement);
  document.body.appendChild(containerDivElement);
})();
