<template>
  <!--<div id="app">-->
    <!--<img src="../assets/image/logo.png">-->
    <!--&lt;!&ndash;<img src="../assets/test/logo.png">&ndash;&gt;-->
    <!--<h1></h1>-->
    <!--<h2>Essential Links</h2>-->
    <!--<input type="text" v-focus/>-->
    <!--<ul>-->
      <!--<li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>-->
      <!--<li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>-->
      <!--<li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>-->
      <!--<li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>-->
    <!--</ul>-->
    <!--<h2>Ecosystem</h2>-->
    <!--<ul>-->
      <!--<li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>-->
      <!--<li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>-->
      <!--<li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>-->
      <!--<li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>-->
    <!--</ul>-->
  <!--</div>-->

  <div id="app" >
    <test v-for="item in items" :item="item" :keyword="keyword"></test>
    <input>
  </div>
</template>

<script>
    import $ from 'jQuery';
    import test from './components/test.vue';

    var win = $(window),
        _winHeight = win.height(),
        _isLoading = false,
        _docHeight;
    const getDataHeight = 500;

    var App = {
        name: 'app',
        data () {
            return {
               keyword : '',
               items : []
            }
        },
        created () {
            this.keyword = '二';
            this.getData();
        },
        mounted (){
            window.sogou.pb.pv();

            win.scroll(()=>{
                if(win.scrollTop() >= _docHeight - _winHeight - getDataHeight){
                    this.getData();
                }
            });

            win.resize(()=>{
                _winHeight = win.height();
            });
        },
        methods : {
            getData (){
                if(!_isLoading){
                    _isLoading = true;
                    $.ajax({
                        url : '/api/name',
                        dataType : 'json',
                        success : (json)=>{
                            this.$data.items = json.rec_1.rec.concat(this.$data.items);
                            this.$nextTick(function(){
                                _docHeight = $(document).height();
                                _isLoading = false;
                            })
                        }
                    })
                }
            }
        },
        components: {
            test
        }
    };

    export default App;
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
