<template>
  <header class="main-header">
    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <router-link to="/">
            <div alt="Logo" class="img-responsive center-block logo" />
          </router-link>
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
            <i class="fa fa-bars"></i>
          </button>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse pull-left" id="navbar-collapse">
          <ul class="nav navbar-nav">
            <!--<router-link to="/" class="navbar-brand">{{ $t('login') }}</router-link>-->
            <li>
              <a href="#">{{ $t('login') }}</a>
            </li>
            <li>
              <a href="#">{{ $t('help') }}</a>
            </li>
            <!--<li class="active"><a href="#">Link</a></li>-->
          </ul>
        </div>
        <!-- /.navbar-collapse -->
      </div>
    </nav>
  </header>
</template>

<style scoped>
.logo {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('/static/img/logoStretch.png');
}
</style>
