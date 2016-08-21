//Set up our socket server
if(io){ //make sure we have socket.io loaded
  var socket = io(':3000'); //connect to our host but on APIs port

  socket.on('relationships_added', handleChanges); //subscribe to adds
  socket.on('relationships_removed', handleChanges); //subscribe to drops
}else{
  console.log('Failed to load Socket.io, API may be down'); //warn us if no connection
}

function handleChanges(changes){ //we just need to see if our changes affect us
  if(graphData){ //make sure we currently have a graph
    var union = _.union([graphData.nodes], _.flatten(changes)); //check for overlap with displayed nodes
    if(union.length) updateGraph(); //if so, then pull new data
  }
}

var domain_name = null;
var depth = 2;
var graphData = null;

function updateGraph(){ //fetch an updated graph using our past params
  window.apiClient.retrieveDomain({domain_name: domain_name, depth: depth})
  .then(function(domain){
    clearFDG(); //We should really do a partial update here, not a re-render
    graphData = domain.obj;
    loadDataIntoForceDirectedGraph(domain.obj);
  });
}

new SwaggerClient({ //connect to our swagger
  url: ':3000/swagger',
  usePromise: true
}).then(function(client){
  $('#search').prop('disabled', false); //enable searches
  window.apiClient = client.apis.default; //save our client
});

$('#search').on('keyup', function(e){ //basic suggestion box
  window.apiClient.listDomains({filter: $('#search').val(), limit: 10})
  .then(function(domains){
    domains = domains.obj;
    $('#searchSuggest').html('');
    domains.forEach(function(domain){
      $('#searchSuggest').append('<li><a class="searchResult" href="#">'+domain+'</a></li>');
    });

    //our suggestion is always a valid domain
    $('.searchResult').on('click', function(e){
      e.preventDefault();
      console.log('Hello', this);
      $('#search').val($(this).html());
      $('#searchForm').submit();
    });
  });
});

//save params and force an "update" (even if this is new data)
$('#searchForm').on('submit', function(e){
  e.preventDefault();
  depth = $('#depth').val() || 2;
  domain_name = $('#search').val();

  updateGraph();
});
