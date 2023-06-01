//var apiEndpoint = 'http://192.200.9.24/consultas/module/gestiones_sat/api/satController.php?FUNC=';
var apiEndpoint = 'https://www.combexim.com.gt/consultas/module/gestiones_sat/api/satController.php?FUNC=';
var Headers = {
  json: { header: 'Content-Type', value: 'application/json' },
  form: { header: 'Content-Type', value: 'application/x-www-form-urlencoded' }
};

var vm = new Vue({
  el: '#app',
  directives: {
    upper: {
      update: function (el) {
        el.value = el.value.toUpperCase();
      }
    }
  },
  mounted: function () {
    this.fetchIntercept = function (r) { function n(e) { if (t[e]) return t[e].exports; var o = t[e] = { exports: {}, id: e, loaded: !1 }; return r[e].call(o.exports, o, o.exports, n), o.loaded = !0, o.exports } var t = {}; return n.m = r, n.c = t, n.p = "", n(0) }([function (r, n, t) { (function (n, e) { "use strict"; function o(r) { if (Array.isArray(r)) { for (var n = 0, t = Array(r.length); n < r.length; n++)t[n] = r[n]; return t } return Array.from(r) } function i(r) { if (!r.fetch) try { t(2) } catch (n) { throw Error("No fetch avaibale. Unable to register fetch-intercept") } r.fetch = function (r) { return function () { for (var n = arguments.length, t = Array(n), e = 0; n > e; e++)t[e] = arguments[e]; return f.apply(void 0, [r].concat(t)) } }(r.fetch) } function f(r) { for (var n = arguments.length, t = Array(n > 1 ? n - 1 : 0), e = 1; n > e; e++)t[e - 1] = arguments[e]; var i = l.reduce(function (r, n) { return [n].concat(r) }, []), f = Promise.resolve(t); return i.forEach(function (r) { var n = r.request, t = r.requestError; (n || t) && (f = f.then(function (r) { return n.apply(void 0, o(r)) }, t)) }), f = f.then(function (n) { return r.apply(void 0, o(n)) }), i.forEach(function (r) { var n = r.response, t = r.responseError; (n || t) && (f = f.then(n, t)) }), f } var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (r) { return typeof r } : function (r) { return r && "function" == typeof Symbol && r.constructor === Symbol ? "symbol" : typeof r }, c = "object" === ("undefined" == typeof navigator ? "undefined" : u(navigator)) && "ReactNative" === navigator.product, s = "object" === ("undefined" == typeof n ? "undefined" : u(n)) && !0, a = "object" === ("undefined" == typeof window ? "undefined" : u(window)), p = "function" == typeof importScripts; if (c) i(e); else if (p) i(self); else if (a) i(window); else { if (!s) throw new Error("Unsupported environment for fetch-intercept"); i(e) } var l = []; r.exports = { register: function (r) { return l.push(r), function () { var n = l.indexOf(r); n >= 0 && l.splice(n, 1) } }, clear: function () { l = [] } } }).call(n, t(1), function () { return this }()) }, function (r, n) { "use strict"; function t() { s = !1, f.length ? c = f.concat(c) : a = -1, c.length && e() } function e() { if (!s) { var r = setTimeout(t); s = !0; for (var n = c.length; n;) { for (f = c, c = []; ++a < n;)f && f[a].run(); a = -1, n = c.length } f = null, s = !1, clearTimeout(r) } } function o(r, n) { this.fun = r, this.array = n } function i() { } var f, u = r.exports = {}, c = [], s = !1, a = -1; u.nextTick = function (r) { var n = new Array(arguments.length - 1); if (arguments.length > 1) for (var t = 1; t < arguments.length; t++)n[t - 1] = arguments[t]; c.push(new o(r, n)), 1 !== c.length || s || setTimeout(e, 0) }, o.prototype.run = function () { this.fun.apply(null, this.array) }, u.title = "browser", u.browser = !0, u.env = {}, u.argv = [], u.version = "", u.versions = {}, u.on = i, u.addListener = i, u.once = i, u.off = i, u.removeListener = i, u.removeAllListeners = i, u.emit = i, u.binding = function (r) { throw new Error("process.binding is not supported") }, u.cwd = function () { return "/" }, u.chdir = function (r) { throw new Error("process.chdir is not supported") }, u.umask = function () { return 0 } }, function (r, n) { r.exports = require("whatwg-fetch") }]);

    this.fetchIntercept.register({
      request: function (url, config) {
        $("#loading").css("display", "block");
        return [url, config];
      },

      requestError: function (error) {
        $("#loading").css("display", "none");
        return Promise.reject(error);
      },

      response: function (response) {
        $("#loading").css("display", "none");
        return response;
      },

      responseError: function (error) {
        $("#loading").css("display", "none");
        return Promise.reject(error);
      }
    });

    console.log("Se ha iniciado el vuejs");
    //this.getChats();
    this.getHistoChats();
    var user = localStorage.getItem('user');
    if (user) {
      var parsedUser = JSON.parse(user);
      this.miId = parsedUser._id;
      this.myUser = parsedUser;
    }

    this.socket = io.connect('http://localhost:3000', {
            query: {
                userId: this.miId // Reemplaza esto con el ID de usuario correspondiente
            }
        });

        var self = this;

        this.socket.on('chat message', function (nuevoMensaje) {
          console.log(self.personasHisto);
            console.log("escucho",nuevoMensaje);
            self.personasHisto = self.personasHisto.map(mensaje => {
              if(mensaje.usuario._id === nuevoMensaje.usuarioOrigen) {
                  mensaje.ultimoMensaje = nuevoMensaje;
              }
              return mensaje;
          });
          
          if(self.idPersonaSelected===nuevoMensaje.usuarioOrigen){
            self.mensajesChat.push(nuevoMensaje);
          }

          self.personasHisto.sort((a, b) => {
            let dateA = new Date(a.ultimoMensaje.date);
            let dateB = new Date(b.ultimoMensaje.date);
        
            // Orden descendente: intercambia 'dateA' y 'dateB' para orden ascendente
            return dateB - dateA;
        });

        });

        this.socket.on('recibio', function (nuevoMensaje) {
          self.mensajesChat.push(nuevoMensaje);
          // let index = self.mensajesChat.findIndex(x => x.date === nuevoMensaje.date);

          // // Si el mensaje existe
          // if (index !== -1) {
          //   // Cambia la propiedad del mensaje
          //   self.mensajesChat[index].recibido = nuevoMensaje.recibido;
          // }
        })

        this.socket.on('user disconnected', function(userId) {
          console.log('El usuario ' + userId + ' se ha desconectado.');
          self.personasHisto.forEach(mensaje => {
              if (mensaje.usuario._id === userId) {
                  mensaje.conectado = false;
              }
          });

        });
        

        this.socket.on('user connected', function(userId) {
          console.log('El usuario ' + userId + ' se ha conectado.');
          self.personasHisto.forEach(mensaje => {
              if (mensaje.usuario._id === userId) {
                  mensaje.conectado = true;
              }
          });
          console.log(self.personasHisto);
        });

        this.socket.on('connect', () => {
          this.serverStatus = 'En línea';
          this.serverStatusClass = 'badge badge-success';
      });

      this.socket.on('disconnect', () => {
          this.serverStatus = 'Desconectado';
          this.serverStatusClass = 'badge badge-danger';
      });



  },
  data: {
    serverStatus: 'Desconectado',
    serverStatusClass: 'badge badge-danger',
    socket:[],
    mensajes: [],
    mensajesChat: [],
    personasHisto: [],
    idPersonaSelected: "",
    NombrePersonaSelected: "",
    formularios: [],
    miId: "",
    myUser: {},
    filtros: {
      fecha_inicio: new Date().toISOString().slice(0, 10),
      fecha_fin: new Date().toISOString().slice(0, 10),
    }
  },
  watch: {
    formularios(val) {

    },
  },
  methods: {
    getImagen(imagen) {
      return imagen || 'https://i.pinimg.com/originals/a9/26/52/a926525d966c9479c18d3b4f8e64b434.jpg';
    }, clickMensajes: function (id,nombre, apellido) {
      console.log(id);
      var self = this;
      self.idPersonaSelected = id;
      self.NombrePersonaSelected= nombre+" "+apellido;
      var raw = JSON.stringify({
        "suCuenta": id,
      });

      fetch("http://localhost:3000/api/chat/listarMesajeConPersona", {
        method: 'POST',
        headers: { "Content-Type": "application/json", 'Authorization': localStorage.getItem('token') },
        body: raw,
        redirect: 'follow'
      })
        .then(response => response.json())
        .then(res => {
          if (res.mensajes) {
            this.mensajesChat = res.mensajes;
          } else if (res.message) {
            throw res.message;
          } else {
            throw 'Error no controlado';
          }
        })
        .catch(function (error) {
          self.alertaPeticion(error);
        });

    },
    getTiempoTranscurrido(fecha) {
      const diferencia = Date.now() - new Date(fecha);
      const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
      return `${minutos} min`;
    },
    getHistoChats: function () {
      fetch('http://localhost:3000/api/chat/listarUltimoMensaje', {
          headers: {
              'Authorization': localStorage.getItem('token'),
          }
      })
      .then(response => response.json())
      .then(data => {
          this.personasHisto = data.mensajes.map(mensaje => {
              return {
                  ...mensaje,
                  conectado: false
              }
          });
      });
  },  
    getChats: function () {
      //console.log(this.filtros);
      var self = this;
      return fetch('http://localhost:3000/api/chat/listarMensajes', {
        headers: {
          'Authorization': localStorage.getItem('token'),
        }
      }).then(resp =>
        resp.json()
      ).then(res => {
        if (res.data) {
          this.mensajes = res.data;
        } else if (res.message) {
          throw res.error;
        }
      }).catch(function (error) {
        self.alertaPeticion(error);
      });

    },alertaPeticion(message) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
      });
    }, alertaExito(message) {
      Swal.fire({
        icon: 'success',
        title: 'Genial...',
        text: message,
      });
    }, login() {
      var self = this;

      var username = this.$el.querySelector('#username-login').value;
      var password = this.$el.querySelector('#password-login').value;

      var raw = JSON.stringify({
        "emailOrNick": username,
        "password": password
      });

      fetch("http://localhost:3000/api/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: raw,
        redirect: 'follow'
      })
        .then(response => response.json())
        .then(res => {
          if (res.token) {
            self.alertaExito('Login successful');
            // Almacena el token en el almacenamiento local del navegador.
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            window.location.href = 'chat.html';
            // Aquí puedes redirigir a la página principal o actualizar el estado de la sesión del usuario.
          } else if (res.message) {
            throw res.message;
          } else {
            throw 'Error no controlado';
          }
        })
        .catch(function (error) {
          self.alertaPeticion(error);
        });
    },formatDatetime: function(datetime) {
      return moment(datetime).format('DD/MM/YYYY HH:mm:ss');
    }, clickEnviar() {
      var self = this;
      var mensaje = this.$el.querySelector('#textoMensaje').value;
      var raw = {
        "mensaje": mensaje,
        "date": new Date().toISOString(),
        "usuarioDestinatario": self.idPersonaSelected,
        "usuarioOrigen":self.miId,
        "nuevo":true,
      };

      fetch("http://localhost:3000/api/chat/postMensaje", {
        method: 'POST',
        headers: { "Content-Type": "application/json", 'Authorization': localStorage.getItem('token') },
        body: JSON.stringify(raw),
        redirect: 'follow'
      }).then(response => response.json())
        .then(res => {
          if (res.data) {
            console.log(res.data);
            this.socket.emit('chat message', raw);
            $("#textoMensaje").val("");

          } else if (res.message) {
            throw res.message;
          }
        })
        .catch(function (error) {
          self.alertaPeticion(error);
        });

    }, registrar() {
      var self = this;

      var Nombre = this.$el.querySelector('#Nombre').value;
      var Apellido = this.$el.querySelector('#Apellido').value;
      var username = this.$el.querySelector('#username').value;
      var email = this.$el.querySelector('#email').value;
      var password = this.$el.querySelector('#password').value;
      var repassword = this.$el.querySelector('#repassword').value;

      var raw = JSON.stringify({
        "nombre": Nombre,
        "apellido": Apellido,
        "nick": username,
        "email": email,
        "password": password
      });

      fetch("http://localhost:3000/api/registrar", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: raw,
        redirect: 'follow'
      }).then(response => response.json())
        .then(res => {
          if (res.data) {
            console.log('Registration successful');
          } else if (res.message) {
            throw res.message;
          }
        })
        .catch(function (error) {
          self.alertaPeticion(error);
        });
    }
  }
});