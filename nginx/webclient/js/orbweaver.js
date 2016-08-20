var orbWeaver = {};
window.orbWeaver = orbWeaver;

var socket = io.connect('http://localhost:3000');
socket.on('relationships_added', handleChanges);
socket.on('relationships_removed', handleChanges);

function handleChanges(changes){
  console.log(changes);
  var union = _.union([graph.nodes], _.flatten(changes));
  if(union.length) updateGraph();
}

var domain_name = null;
var depth = 2;
var graphData = null;

function updateGraph(){
  window.apiClient.retrieveDomain({domain_name: domain_name, depth: depth})
  .then(function(domain){
    clearFDG();
    graphData = domain.obj;
    loadDataIntoForceDirectedGraph(domain.obj);
  });
}

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
  depth = $('#depth').val() || 2;
  domain_name = $('#search').val();

  updateGraph();
});
