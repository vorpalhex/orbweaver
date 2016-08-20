var orbWeaver = {};
window.orbWeaver = orbWeaver;

new SwaggerClient({
  url: 'http://localhost:3000/swagger.yml',
  usePromise: true
}).then(function(client){
  $('#search').prop('disabled', false);
  window.apiClient = client.apis.default;
});

$('#search').on('keyup', function(e){
  console.log('change', window.apiClient);
  window.apiClient.listDomains({filter: $('#search').val(), limit: 10})
  .then(function(domains){
    $('#searchSuggest').innerHtml('');
    domains.forEach(function(domain){
      $('#searchSuggest').append('<li><a href="#">'+domain+'</a></li>');
    });
  });
});

$('#searchSuggest > li').on('click', function(e){
  $('#search').val(this.val());
});

$('#searchForm').on('submit', function(e){
  e.preventDefault();
});
