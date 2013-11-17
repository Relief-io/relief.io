
app.config( function( $routeProvider ) {
  $routeProvider
    .when( '/sso', {
      controller: 'SSOController',
      templateUrl: '/feature/sso/index.html'
    })
});