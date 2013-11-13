
app.controller( 'MapIndexController', function( $rootScope, $scope ) {
  $scope.tweets = [];
  $scope.loadedTweets = [];

  // Create a new popup on the map
  function addTweet( tweet ){
    var popup = L.popup()
        .setLatLng( tweet.geo.coordinates )
        .setContent( tweet.text )
        .addTo( $scope.map );
    // console.log( popup );

    // Close it after some time
    setTimeout( function(){
      popup._close();
    }, 8000 );
  }

  // Connect to firebase to get tweets
  var myRootRef = new Firebase( $rootScope.config['firebase.host'] );
  var tweets = {
    local: myRootRef.child('tweet_local').limit(5),
    overseas: myRootRef.child('tweet_overseas').limit(5),
    all: myRootRef.child('tweet').limit(5)
  };

  // Init the map
  $scope.map = L.map( 'map', { zoomControl:false } );
  L.tileLayer.provider('Nokia.terrainDay', {
    devID: 'pT52rESblK2luN6D0562LQ',
    appId: 'yKqVsh6qFoKdZQmFP2Cn'
  }).addTo( $scope.map );

  // Center map
  $scope.map.setView( [ 12.46876, 118.698438 ], 6 );

 // On local (philippine) tweets
  tweets.local.on( 'child_added', function( message ){
    var tweet = message.val();
    addTweet( tweet );
    // console.log( 'local', tweet );
  });

  $scope.tweetsCount = 0;

  loadNTweets = function(n) {
        var tweets = $scope.tweets.slice(0,n);
        $scope.tweets.splice(0,n);
        $scope.tweetsCount -= n;
        for(var i in tweets) {
            $scope.loadedTweets.splice(0,1)
            $scope.loadedTweets.push( tweets[i] );
        }
  };


  $scope.loadMoreTweets = function(amount, message) {
    // button works only if there tweets to read
    if( $scope.tweets.length > 0 && $scope.tweets.length < 6 ) {
        loadNTweets($scope.tweets.length);
    }
    else if( $scope.tweets.length >= 6 ) {
        loadNTweets(6);
    }
  };

  updateTweetCount = function(tweet) {
    $scope.$apply( function(){
      $scope.tweetsCount++;
    });
  };

  formatTweet = function(tweet) {
    $scope.$apply( function(){
      if( tweet.entities ){
        if( Array.isArray( tweet.entities.user_mentions ) ){
          for( var i=0; i<tweet.entities.user_mentions.length; i++ ){
            tweet.text = tweet.text.replace( '@'+tweet.entities.user_mentions[i].screen_name, function( name ){
              return '<a href="https://twitter.com/'+name.substr(1)+'" target="_blank">'+name+'</a>';
            });
          }
        }
        if( Array.isArray( tweet.entities.hashtags ) ){
          for( var i=0; i<tweet.entities.hashtags.length; i++ ){
            tweet.text = tweet.text.replace( '#'+tweet.entities.hashtags[i].text, function( tag ){
              return '<a href="https://twitter.com/search?q='+tag.substr(1)+'&src=typd" target="_blank">'+tag+'</a>';
            });
          }
        }
        if( Array.isArray( tweet.entities.urls ) ){
          for( var i=0; i<tweet.entities.urls.length; i++ ){
            tweet.text = tweet.text.replace( tweet.entities.urls[i].url, function( link ){
              return '<a href="'+link+'" target="_blank">'+link+'</a>';
            });
          }
        }
        // console.log( JSON.stringify( tweet.entities.urls ) );
      }
    });

  };

  // On overseas tweets
  // tweets.overseas.on( 'child_added', function( message ){
  //   var tweet = message.val();
  //   addTweet( tweet );
  //   console.log( 'overseas', tweet.text );
  // });

  tweets.all.on( 'child_added', function( message ){
    var tweet = message.val();
    if($scope.loadedTweets.length < 6) {
      formatTweet(tweet);
      $scope.loadedTweets.push( tweet );
    } else {
        // limit quantity of tweets on memory remove oldest with every new tweets
        if($scope.tweets.length >= 100){
            $scope.tweets = $scope.tweets.slice(1,$scope.tweets.length);
        } else {
            updateTweetCount()
        }
        $scope.tweets.push( tweet );
    }

    // if( tweet.text.match( /yfrog|twitpic|twimg|twitter|img|pic/ ) ){
    //   console.log( tweet.text );
    // }

    // if( tweet.entities ){
      // console.log( 'tweet.entities', tweet.entities );
      // if( tweet.entities.urls ){
      //   console.log( tweet.entities.urls.map( function( url ){
      //     return url.display_url;
      //   }));
      // }
    // }
  });

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      // Successful!
      /*
      alert(
        pos.coords.latitude + ":" + pos.coords.longitude + ":" + pos.coords.accuracy
      );
      */
      console.log("Latitude: " + pos.coords.latitude);
      console.log("Longitude: " + pos.coords.longitude);

      $('#login-lon').val([ pos.coords.longitude ]);
      $('#login-lat').val([ pos.coords.latitude ]);
      //$('#login-loc').val();

      /*
      var map = L.map('map').setView([pos.coords.latitude, pos.coords.longitude], 17);

      L.tileLayer('http://{s}.tile.cloudmade.com/233b2eebc57a4adcb92e00d5cd40a90e/997/256/{z}/{x}/{y}.png', {
          attribution: '',
          maxZoom: 18
      }).addTo(map);

      var marker = L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map);
      */
      }, function(error) {
        alert("Error!");
      },
      {
        // Options for geolocation
        maximumAge: 10000,
        timeout: 10000,
        enableHighAccuracy: true
      }
    );

    // Load geo with d3
    console.log('d3 = ', d3);

    var svg = d3.select($scope.map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

    d3.json("/data/geo/regions/r3/r3.geojson", function(collection) {
      var transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform),
      bounds = path.bounds(collection);

      var feature = g.selectAll("path")
          .data(collection.features)
        .enter().append("path");

      $scope.map.on("viewreset", reset);
      reset();

      // Reposition the SVG to cover the features.
      function reset() {
        var topLeft = bounds[0],
            bottomRight = bounds[1];

        svg.attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d", path);
      }

      // Use Leaflet to implement a D3 geometric transformation.
      function projectPoint(x, y) {
        var point = $scope.map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
    });
    /* TopoJSON test
    var path = d3.geo.path();

    var svg = d3.select("body").append("svg")
        .attr("width", 300)
        .attr("height", 300);


    d3.json("/data/geo/regions/r3/r3.topojson", function(error, topology) {
      svg.selectAll("path")
          .data(topojson.feature(topology, topology.objects.collection.geometries[0]).features)
        .enter().append("path")
          .attr("d", path);
    });
    */
});
