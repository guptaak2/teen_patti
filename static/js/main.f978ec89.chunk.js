(this.webpackJsonpteen_patti=this.webpackJsonpteen_patti||[]).push([[0],{29:function(e,t,a){e.exports=a(62)},34:function(e,t,a){},35:function(e,t,a){},62:function(e,t,a){"use strict";a.r(t);var n=a(2),s=a.n(n),r=a(26),i=a.n(r),o=(a(34),a(8)),l=a(9),c=a(11),u=a(10),m=(a(35),a(27)),d=a.n(m).a.initializeApp({apiKey:"AIzaSyB8PcAZcXkzuqhwiE1itEi3XZ6z6lFjsSM",authDomain:"teen-patti-5a5fc.firebaseapp.com",databaseURL:"https://teen-patti-5a5fc.firebaseio.com",projectId:"teen-patti-5a5fc",storageBucket:"teen-patti-5a5fc.appspot.com",messagingSenderId:"478653158074",appId:"1:478653158074:web:315fbf33f859b2a4632883",measurementId:"G-8WZ36J1853"}),h=a(28),p=a(12),f=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).login=n.login.bind(Object(p.a)(n)),n.handleChange=n.handleChange.bind(Object(p.a)(n)),n.signup=n.signup.bind(Object(p.a)(n)),n.state={email:"",password:""},n}return Object(l.a)(a,[{key:"handleChange",value:function(e){this.setState(Object(h.a)({},e.target.name,e.target.value))}},{key:"login",value:function(e){e.preventDefault(),d.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((function(e){})).catch((function(e){console.log(e)}))}},{key:"signup",value:function(e){e.preventDefault(),d.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then((function(e){})).then((function(e){console.log(e)})).catch((function(e){console.log(e)}))}},{key:"render",value:function(){return s.a.createElement("div",{align:"center"},s.a.createElement("div",{className:"Login"},s.a.createElement("form",null,s.a.createElement("div",{class:"form-group"},s.a.createElement("label",{for:"exampleInputEmail1"},"Email address: "),s.a.createElement("input",{value:this.state.email,style:{marginLeft:"25px",marginBottom:"12px"},onChange:this.handleChange,type:"email",name:"email",class:"form-control",id:"exampleInputEmail1","aria-describedby":"emailHelp",placeholder:"Enter email"})),s.a.createElement("div",{class:"form-group"},s.a.createElement("label",{for:"exampleInputPassword1"},"Password: "),s.a.createElement("input",{value:this.state.password,style:{marginLeft:"54px",marginBottom:"12px"},onChange:this.handleChange,type:"password",name:"password",class:"form-control",id:"exampleInputPassword1",placeholder:"Password"})),s.a.createElement("button",{type:"submit",onClick:this.login,class:"btn btn-primary"},"Login"),s.a.createElement("button",{onClick:this.signup,style:{marginLeft:"25px"},className:"btn btn-success"},"Signup"))))}}]),a}(n.Component),g=a(15),b=a.n(g),v="https://us-central1-teen-patti-5a5fc.cloudfunctions.net",E=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={cards:[],message:""},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this;return b.a.get(v+"/getCards").then((function(t){e.setState({cards:t.data})}))}},{key:"addItem",value:function(e){var t=this;e.preventDefault();var a=this.state.cards,n=this.newItem.value;if(!a.includes(n))return""!==n&&b.a.post(v+"/addCards",{item:n}).then((function(e){t.setState({cards:e.data})}));this.setState({message:"This item is already on the list"})}},{key:"clearAll",value:function(){this.setState({cards:[],message:"No cards in the list, add some"})}},{key:"renderCards",value:function(){var e=this.state,t=e.cards;e.message;return t.map((function(e){return s.a.createElement("h3",null,e.item)}))}},{key:"render",value:function(){var e=this,t=this.state;t.cards,t.message;return s.a.createElement("div",{className:"container"},s.a.createElement("h1",null,"Your cards are:"),s.a.createElement("form",{ref:function(t){e.addForm=t},className:"form-inline",onSubmit:this.addItem.bind(this)},s.a.createElement("div",{className:"form-group"},s.a.createElement("label",{htmlFor:"newItemInput",className:"sr-only"},"Add New Card"),s.a.createElement("input",{ref:function(t){e.newItem=t},type:"text",className:"form-control",id:"newItemInput"})),s.a.createElement("button",{className:"btn btn-primary"},"Add")),this.renderCards())}}]),a}(n.Component),y=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(){var e;return Object(o.a)(this,a),(e=t.call(this)).state={user:{}},e}return Object(l.a)(a,[{key:"componentDidMount",value:function(){this.authListener()}},{key:"authListener",value:function(){var e=this;d.auth().onAuthStateChanged((function(t){console.log(t),t?e.setState({user:t}):e.setState({user:null})}))}},{key:"render",value:function(){return s.a.createElement("div",{className:"App"},s.a.createElement("h2",null,"Welcome to Teen Patti"),s.a.createElement("div",null,this.state.user?s.a.createElement(E,null):s.a.createElement(f,null)))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[29,1,2]]]);
//# sourceMappingURL=main.f978ec89.chunk.js.map