(this.webpackJsonpteen_patti=this.webpackJsonpteen_patti||[]).push([[0],{48:function(e,t,a){},52:function(e,t,a){e.exports=a.p+"static/media/logo.f67306a7.png"},62:function(e,t,a){e.exports=a(82)},67:function(e,t,a){},82:function(e,t,a){"use strict";a.r(t);var s=a(0),r=a.n(s),n=a(11),i=a.n(n),l=(a(67),a(28)),c=a(29),d=a(32),o=a(31),u=(a(48),a(7)),h=a.n(u),m=h.a.initializeApp({apiKey:"AIzaSyB8PcAZcXkzuqhwiE1itEi3XZ6z6lFjsSM",authDomain:"teen-patti-5a5fc.firebaseapp.com",databaseURL:"https://teen-patti-5a5fc.firebaseio.com",projectId:"teen-patti-5a5fc",storageBucket:"teen-patti-5a5fc.appspot.com",messagingSenderId:"478653158074",appId:"1:478653158074:web:315fbf33f859b2a4632883",measurementId:"G-8WZ36J1853"}),f=a(10),v=a(108),p=a(111),C=a(110),g=function(e){Object(d.a)(a,e);var t=Object(o.a)(a);function a(e){var s;return Object(l.a)(this,a),(s=t.call(this,e)).login=s.login.bind(Object(f.a)(s)),s.signup=s.signup.bind(Object(f.a)(s)),s.handleEmailFieldChange=s.handleEmailFieldChange.bind(Object(f.a)(s)),s.handlePasswordFieldChange=s.handlePasswordFieldChange.bind(Object(f.a)(s)),s.handleFirstNameFieldChange=s.handleFirstNameFieldChange.bind(Object(f.a)(s)),s.writeNewUser=s.writeNewUser.bind(Object(f.a)(s)),s.state={firstName:"",email:"",password:"",emailHelperText:"Please enter your email",passwordHelperText:"Please enter your password",emailError:!1,passwordError:!1},s}return Object(c.a)(a,[{key:"login",value:function(e){var t=this;e.preventDefault(),m.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((function(e){m.database().ref("users/list/"+m.auth().currentUser.uid).set({email:t.state.email,name:t.state.firstName,isLoggedIn:!0,status:"BLIND",showCardsMessage:""}),t.setState({emailError:!1,emailHelperText:"Please enter your email",passwordError:!1,passwordHelperText:"Please enter your password"})})).catch((function(e){console.log(e),"auth/wrong-password"==e.code?t.setState({emailError:!1,emailHelperText:"Please enter your email",passwordHelperText:"Incorrect password. Please try again",passwordError:!0}):"auth/invalid-email"==e.code?t.setState({emailHelperText:"Invalid email. Please try again",emailError:!0,passwordError:!1,passwordHelperText:"Please enter your password"}):"auth/user-not-found"==e.code&&t.setState({emailHelperText:"This user does not exist. Please signup.",emailError:!0,passwordError:!1,passwordHelperText:"Please enter your password"})}))}},{key:"signup",value:function(e){var t=this;e.preventDefault(),m.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then((function(e){e.user&&(t.setState({emailError:!1,emailHelperText:"Please enter your email",passwordError:!1,passwordHelperText:"Please enter your password"}),e.user.updateProfile({displayName:t.state.firstName}),t.writeNewUser())})).catch((function(e){console.log(e),"auth/weak-password"==e.code&&t.setState({emailError:!1,emailHelperText:"Please enter your email",passwordError:!0,passwordHelperText:"Password should be at least 6 characters"})}))}},{key:"writeNewUser",value:function(){var e=m.auth().currentUser.uid,t={};t["users/list/"+e]=e,m.database().ref().update(t),m.database().ref("users/list/"+e).set({email:this.state.email,name:this.state.firstName,isLoggedIn:!0,status:"BLIND",showCardsMessage:""},(function(e){e?console.log("User save error"):console.log("User saved successfully")}))}},{key:"handleEmailFieldChange",value:function(e){e.preventDefault(),this.setState({email:e.target.value})}},{key:"handlePasswordFieldChange",value:function(e){e.preventDefault(),this.setState({password:e.target.value})}},{key:"handleFirstNameFieldChange",value:function(e){e.preventDefault(),this.setState({firstName:e.target.value})}},{key:"render",value:function(){return r.a.createElement("div",{align:"center"},r.a.createElement("div",{className:"Login"},r.a.createElement("form",null,r.a.createElement(C.a,null,r.a.createElement(v.a,{id:"firstName",label:"First name (lowercase)",value:this.state.firstName,onChange:this.handleFirstNameFieldChange,helperText:"Please enter your first name"})),r.a.createElement(C.a,null,r.a.createElement(v.a,{id:"email",label:"Email",value:this.state.email,onChange:this.handleEmailFieldChange,helperText:this.state.emailHelperText,error:!!this.state.emailError})),r.a.createElement("br",null),r.a.createElement(C.a,null,r.a.createElement(v.a,{id:"password",type:"password",label:"Password",value:this.state.password,onChange:this.handlePasswordFieldChange,helperText:this.state.passwordHelperText,error:!!this.state.passwordError})),r.a.createElement(C.a,{m:2,pt:3},r.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.login.bind(this)},"LOGIN")),r.a.createElement(C.a,null,r.a.createElement(p.a,{className:"btn btn-success",variant:"contained",color:"primary",onClick:this.signup.bind(this)},"SIGN UP")))))}}]),a}(s.Component),b={display:"flex",justifyContent:"center"},E={display:"grid"},y={display:"flex",justifyContent:"center"},w=function(e){Object(d.a)(a,e);var t=Object(o.a)(a);function a(e){var s;return Object(l.a)(this,a),(s=t.call(this,e)).logout=s.logout.bind(Object(f.a)(s)),s.handleNumPlayersFieldChange=s.handleNumPlayersFieldChange.bind(Object(f.a)(s)),s.handleNumCardsFieldChange=s.handleNumCardsFieldChange.bind(Object(f.a)(s)),s.generate=s.generate.bind(Object(f.a)(s)),s.getCards=s.getCards.bind(Object(f.a)(s)),s.getRealCards=s.getRealCards.bind(Object(f.a)(s)),s.resetGame=s.resetGame.bind(Object(f.a)(s)),s.packed=s.packed.bind(Object(f.a)(s)),s.showCards=s.showCards.bind(Object(f.a)(s)),s.updateTable=s.updateTable.bind(Object(f.a)(s)),s.scrollToBottom=s.scrollToBottom.bind(Object(f.a)(s)),s.getCellColor=s.getCellColor.bind(Object(f.a)(s)),s.state={cardIndicies:[],firstCard:[],secondCard:[],thirdCard:[],fourthCard:[],playerStats:[],message:"",numPlayers:0,numCards:3,userState:s.props.userState,displayName:"",gameSet:!0},s}return Object(c.a)(a,[{key:"componentDidUpdate",value:function(){this.scrollToBottom()}},{key:"scrollToBottom",value:function(){this.refs.cardsStats.scrollIntoView({behavior:"smooth",block:"end",inline:"nearest"})}},{key:"componentDidMount",value:function(){var e=this;h.a.auth().onAuthStateChanged((function(t){t&&e.setState({displayName:t.displayName,userState:t})})),h.a.database().ref("users").on("value",(function(t){var a=t.val();e.setState({gameSet:a.isGameSet,numCards:parseInt(a.numCardsPerPlayer),numPlayers:parseInt(a.numPlayers)})})),h.a.database().ref("users/list").on("child_changed",(function(t){e.updateTable()})),this.scrollToBottom()}},{key:"updateTable",value:function(){var e=this;this.setState({playerStats:[]}),h.a.database().ref("users").child("list").once("value").then((function(t){t.forEach((function(t){if(t.val().isLoggedIn){var a=t.val().name,s=t.val().status,r=t.val().showCardsMessage;"SHOW"==s?e.setState({playerStats:e.state.playerStats.concat({name:a,status:s,message:r})}):e.setState({playerStats:e.state.playerStats.concat({name:a,status:s})})}}))}))}},{key:"logout",value:function(){var e=this;h.a.database().ref("users/list/"+h.a.auth().currentUser.uid).update({isLoggedIn:!1,status:"BLIND"}).then((function(t){h.a.auth().signOut().then((function(t){e.setState({userState:null})}))}))}},{key:"resetGame",value:function(e){e.preventDefault();var t={},a=h.a.database().ref("users/");t.isGameSet=!1,this.setState({gameSet:!1,firstCard:[],secondCard:[],thirdCard:[],fourthCard:[],playerStats:[]}),a.update(t).then((function(e){h.a.database().ref("users").child("list").once("value").then((function(e){e.forEach((function(e){e.val().isLoggedIn&&h.a.database().ref("users/list/"+e.key).update({cards:null,status:"BLIND",showCardsMessage:""})}))}))}))}},{key:"generate",value:function(e){var t=this;e.preventDefault();var a={},s=h.a.database().ref("users/");a.isGameSet=!0,s.update(a).then((function(e){t.setState({gameSet:!0})}));for(var r=new Set,n=[],i=0;i<52;i++){var l=Math.floor(51*Math.random());r.add(l)}for(var c=r.values(),d=this.state.numCards,o=0;o<this.state.numPlayers;o++)n[o]=1==d?[c.next().value]:2==d?[c.next().value,c.next().value]:3==d?[c.next().value,c.next().value,c.next().value]:4==d?[c.next().value,c.next().value,c.next().value,c.next().value]:[c.next().value,c.next().value,c.next().value];var u=0;h.a.database().ref("users").child("list").once("value").then((function(e){e.forEach((function(e){e.val().isLoggedIn&&u<t.state.numPlayers&&(h.a.database().ref("users/list/"+e.key).update({cards:n[u]}),u++)}))}))}},{key:"getCards",value:function(e){var t=this;e.preventDefault(),1==this.state.gameSet?h.a.database().ref("users/list/"+h.a.auth().currentUser.uid+"/cards").once("value").then((function(e){t.setState({cardIndicies:e.val()}),t.getRealCards()})).then((function(e){h.a.database().ref("users/list/"+h.a.auth().currentUser.uid).update({status:"SEEN"})})):console.log("Trying to get cards when you're not in a game")}},{key:"getRealCards",value:function(){var e=this,t=this.state.numCards;1==t?h.a.database().ref("cards/"+this.state.cardIndicies[0]).once("value").then((function(t){e.setState({firstCard:t.val()})})):2==t?h.a.database().ref("cards/"+this.state.cardIndicies[0]).once("value").then((function(t){e.setState({firstCard:t.val()})})).then((function(t){h.a.database().ref("cards/"+e.state.cardIndicies[1]).once("value").then((function(t){e.setState({secondCard:t.val()})}))})):3==t?h.a.database().ref("cards/"+this.state.cardIndicies[0]).once("value").then((function(t){e.setState({firstCard:t.val()})})).then((function(t){h.a.database().ref("cards/"+e.state.cardIndicies[1]).once("value").then((function(t){e.setState({secondCard:t.val()})})).then((function(t){h.a.database().ref("cards/"+e.state.cardIndicies[2]).once("value").then((function(t){e.setState({thirdCard:t.val()})}))}))})):4==t?h.a.database().ref("cards/"+this.state.cardIndicies[0]).once("value").then((function(t){e.setState({firstCard:t.val()})})).then((function(t){h.a.database().ref("cards/"+e.state.cardIndicies[1]).once("value").then((function(t){e.setState({secondCard:t.val()})})).then((function(t){h.a.database().ref("cards/"+e.state.cardIndicies[2]).once("value").then((function(t){e.setState({thirdCard:t.val()})})).then((function(t){h.a.database().ref("cards/"+e.state.cardIndicies[3]).once("value").then((function(t){e.setState({fourthCard:t.val()})}))}))}))})):h.a.database().ref("cards/"+this.state.cardIndicies[0]).once("value").then((function(t){e.setState({firstCard:t.val()})})).then((function(t){h.a.database().ref("cards/"+e.state.cardIndicies[1]).once("value").then((function(t){e.setState({secondCard:t.val()})})).then((function(t){h.a.database().ref("cards/"+e.state.cardIndicies[2]).once("value").then((function(t){e.setState({thirdCard:t.val()})}))}))}))}},{key:"handleNumPlayersFieldChange",value:function(e){var t=this;e.preventDefault();var a=e.target.value,s={};s["users/numPlayers"]=a,h.a.database().ref().update(s).then((function(e){t.setState({numPlayers:a})}))}},{key:"handleNumCardsFieldChange",value:function(e){var t=this;e.preventDefault();var a=e.target.value,s={};s["users/numCardsPerPlayer"]=a,h.a.database().ref().update(s).then((function(e){t.setState({numCards:a})}))}},{key:"packed",value:function(e){e.preventDefault(),h.a.database().ref("users/list/"+h.a.auth().currentUser.uid).update({status:"PACK"})}},{key:"showCards",value:function(e){e.preventDefault();var t=this.state.numCards,a="";1==t?a+="".concat(this.state.firstCard.card," ").concat(this.state.firstCard.suit):2==t?a+="".concat(this.state.firstCard.card," ").concat(this.state.firstCard.suit," ").concat(this.state.secondCard.card," ").concat(this.state.secondCard.suit):3==t?a+="".concat(this.state.firstCard.card," ").concat(this.state.firstCard.suit," ").concat(this.state.secondCard.card," ").concat(this.state.secondCard.suit," ").concat(this.state.thirdCard.card," ").concat(this.state.thirdCard.suit):4==t&&(a+="".concat(this.state.firstCard.card," ").concat(this.state.firstCard.suit," ").concat(this.state.secondCard.card," ").concat(this.state.secondCard.suit," ").concat(this.state.thirdCard.card," ").concat(this.state.thirdCard.suit," ").concat(this.state.fourthCard.card," ").concat(this.state.fourthCard.suit)),this.setState({message:a}),h.a.database().ref("users/list/"+h.a.auth().currentUser.uid).update({status:"SHOW",showCardsMessage:a})}},{key:"renderCards",value:function(){var e=this.state.numCards;return r.a.createElement("div",{style:y},1==e&&r.a.createElement("div",{style:y},r.a.createElement("h2",null,this.state.firstCard.card," ",this.state.firstCard.suit)),2==e&&r.a.createElement("div",{style:y},r.a.createElement("h2",null,this.state.firstCard.card," ",this.state.firstCard.suit),r.a.createElement("h2",null,this.state.secondCard.card," ",this.state.secondCard.suit)),3==e&&r.a.createElement("div",{style:y},r.a.createElement("h2",null,this.state.firstCard.card," ",this.state.firstCard.suit)," ",r.a.createElement("h2",null,this.state.secondCard.card," ",this.state.secondCard.suit)," ",r.a.createElement("h2",null,this.state.thirdCard.card," ",this.state.thirdCard.suit)),4==e&&r.a.createElement("div",{style:y},r.a.createElement("h2",null,this.state.firstCard.card," ",this.state.firstCard.suit),r.a.createElement("h2",null,this.state.secondCard.card," ",this.state.secondCard.suit),r.a.createElement("h2",null,this.state.thirdCard.card," ",this.state.thirdCard.suit),r.a.createElement("h2",null,this.state.fourthCard.card," ",this.state.fourthCard.suit)))}},{key:"renderStats",value:function(){var e=this,t=this.state.playerStats,a=t.slice(Math.max(t.length-parseInt(this.state.numPlayers),0));return r.a.createElement("div",{style:E},r.a.createElement("table",{align:"center",border:"1",width:"500px"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,r.a.createElement("h2",null,"Name")),r.a.createElement("th",null,r.a.createElement("h2",null,"Status")),r.a.createElement("th",null,r.a.createElement("h2",null,"Cards")))),r.a.createElement("tbody",null,a.map((function(t,a){return r.a.createElement("tr",{key:a},r.a.createElement("td",null,r.a.createElement("h3",null,t.name)),r.a.createElement("td",{style:{"background-color":e.getCellColor(t)}},r.a.createElement("h3",null,t.status)),r.a.createElement("td",null,r.a.createElement("h3",null,t.message)))})))))}},{key:"getCellColor",value:function(e){return"BLIND"==e.status?"red":"PACK"==e.status?"green":"yellow"}},{key:"render",value:function(){return r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"setup_game",style:b},!this.state.gameSet&&r.a.createElement("div",{style:b},r.a.createElement(C.a,{m:2},r.a.createElement(v.a,{id:"numPlayers",label:"Number of players",value:this.state.numPlayers,onChange:this.handleNumPlayersFieldChange,helperText:"Please enter the number of players"})),r.a.createElement(C.a,{m:2},r.a.createElement(v.a,{id:"numCards",label:"Number of cards",value:this.state.numCards,onChange:this.handleNumCardsFieldChange,helperText:"Please enter the number of cards"})),r.a.createElement(C.a,{m:2,pt:3},r.a.createElement(p.a,{variant:"contained",color:"secondary",onClick:this.generate.bind(this)},"SETUP GAME"))," ")),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(C.a,null,r.a.createElement(p.a,{size:"large",variant:"outlined",color:"primary"},"Hello, ",this.state.displayName)),r.a.createElement("div",{className:"logout_reset",style:b},r.a.createElement(C.a,{m:2},r.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.logout.bind(this)},"Logout")),r.a.createElement(C.a,{m:2},r.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.resetGame.bind(this)},"Reset Game"))),r.a.createElement("div",{className:"logout_reset",style:b},r.a.createElement(C.a,{m:2},r.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.getCards.bind(this)},"See Cards")),r.a.createElement(C.a,{m:2},r.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.packed.bind(this)},"Pack")),r.a.createElement(C.a,{m:2},r.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.showCards.bind(this)},"Show Cards"))),r.a.createElement("div",{style:y},r.a.createElement("h2",null,"Your cards are:"),this.renderCards()),r.a.createElement("div",{ref:"cardsStats"},this.renderStats()))}}]),a}(s.Component),S=a(52),k=a.n(S),P=function(e){Object(d.a)(a,e);var t=Object(o.a)(a);function a(){var e;return Object(l.a)(this,a),(e=t.call(this)).state={user:{}},e}return Object(c.a)(a,[{key:"componentDidMount",value:function(){this.authListener()}},{key:"authListener",value:function(){var e=this;m.auth().onAuthStateChanged((function(t){t?e.setState({user:t}):e.setState({user:null})}))}},{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("img",{src:k.a,width:"200",alt:"logo-image"}),r.a.createElement("br",null),r.a.createElement("div",null,this.state.user?r.a.createElement(w,{userState:this.state.user}):r.a.createElement(g,null)))}}]),a}(s.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(P,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[62,1,2]]]);
//# sourceMappingURL=main.a09304f4.chunk.js.map