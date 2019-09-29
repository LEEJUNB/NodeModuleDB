/*
클라이언트에서 보내는 요청의 단점 : 누가 요청을 보냈는지 모른다는 것. 요청을 보내는 IP주소, Browser 정보를 받아올수 있으나 IP주소를 공통으로 쓰거나 한 컴퓨터를 여러명이 사용할 때는 구별힘듦
이 단점을 극복하려면 로그인을 해야한다
웹 사이트를 방문해서 로그인할 때 내부적으로 쿠키, 세션을 사용함.
새로고침을 해도 로그아웃되지 않는 이유는 cli가 server에게 누구지인지를 계속 알려주기 때문이다.
누구인지 기억하기 위해 서버는 요청에 대한 응답시 쿠키를 같이 보내준다.
쿠키는 단순한 키-값 쌍이다
서버로부터 쿠키가 오면 웹브라우저는 쿠키를 저장했다가 요청할 때마다 쿠키를 같이 보낸다
서버는 요청에 든 쿠키를 읽고 사용자를 파악한다.

서버는 cli에 요청자를 추정할 만한 정보를 쿠키와 함께 보내고 그 다음부터 cli로부터 쿠키받아 요청자 파악
쿠키는 요청과 응답의 헤더에 저장
요청,응답은 각각 헤더와 본문을 가진다.
*/

// 서버에서 직접 parseCookies 함수라는 쿠키를 만들어 요청자의 브라우저에 넣어보자
const http = require('http');
const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k,v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer((req,res) => {
    const cookies = parseCookies(req,headers.cookie); // createServer메서드의 콜백에선 가장 req객체에 담긴 쿠키를 분석. 쿠키는 req.headers.cookie에 들어있음. req.header는 요청헤더의미
    console.log(req.url, cookies); // req.url은 주소의 path,search부분을 알려줌
    
    // 쿠키는 요청과 응답의 헤더를 통해 오고가기에 res.writeHead메서드를 사용하여 쿠키를 응답의 헤더에 기록한다.
    res.writeHead(200, { 'Set-Cookie':'mycookie=test'});  // Set-Cookie는 브라우저에게 쿠키 값을 저장하란 의미. mycookie=test라는 쿠키를 저장
    res.end('Hello Cookie');
})
    .listen(8082, () => {
        console.log('8082번 포트에서 서버 대기 중');
    });
