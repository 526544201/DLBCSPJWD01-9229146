const environment = {
    apiUrl: 'http://localhost/PHP-API/PHP/',
    config: {
      headers: {
        'X-Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    }
  };
  
export default environment;