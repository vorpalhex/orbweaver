var orbWeaver = {};
window.orbWeaver = orbWeaver;

new SwaggerClient({
  url: 'http://localhost:3000/swagger',
  usePromise: true
}).then(function(client){
  $('#search').prop('disabled', false);
  window.apiClient = client.apis.default;
});

$('#search').on('keyup', function(e){
  window.apiClient.listDomains({filter: $('#search').val(), limit: 10})
  .then(function(domains){
    domains = domains.obj;
    $('#searchSuggest').html('');
    domains.forEach(function(domain){
      $('#searchSuggest').append('<li><a class="searchResult" href="#">'+domain+'</a></li>');
    });

    $('.searchResult').on('click', function(e){
      e.preventDefault();
      console.log('Hello', this);
      $('#search').val($(this).html());
      $('#searchForm').submit();
    });
  });
});

$('#searchForm').on('submit', function(e){
  e.preventDefault();
  var depth = $('#depth').val() || 2;
  window.apiClient.retrieveDomain({domain_name: $('#search').val(), depth: depth})
  .then(function(domain){
    clearFDG();
    loadDataIntoForceDirectedGraph(domain.obj);
    // d3.json('/miserables.json', function(err, graph){
    //   loadDataIntoForceDirectedGraph(graph);
    // });
  });
});
