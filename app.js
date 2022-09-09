//--------------------------------------------------------------------------//
//---------------------------Globales---------------------------------------//
//--------------------------------------------------------------------------//
//Diccionario de palabras posibles
let diccionario =['AMOR', 'CAFE', 'EQUIPO', 'GUITARRA', 'PLASTICO', 'CREMA', 'MARTILLO', 'LIBRO', 'LAPIZ', 'TEMOR', 'ALUMINIO', 'BARCO', 'LETRA', 'MIEL', 'RUEDA', 'ESCUELA', 'ACERO', 'PERRO', 'LLAVE', 'SILLA', 'CUNA', 'TECLADO', 'TENEDOR', 'MAPA', 'MENSAJE', 'COHETE', 'REY', 'EDIFICIO', 'HOJA', 'FAMILIA', 'GRANIZO', 'FLOR', 'SALUD', 'HOMBRE', 'MUJER', 'VELERO', 'ABUELA', 'GUERRA', 'PALO', 'TEMPLO', 'LENTES', 'NUBE', 'BOTELLA', 'CASTILLO', 'VERANO', 'RIQUEZA', 'PERSONA', 'GUANTE', 'PLANETA', 'PODER', 'MUELA', 'PERCHA', 'TIEMPO', 'CUADERNO', 'PARED', 'RUIDO', 'SUERTE', 'CARTA', 'CORBATA', 'ALMA', 'PLANTA', 'ZAPATO', 'OFICINA', 'PRADERA', 'ENSALADA', 'DEPORTE', 'AVE', 'NIEVE', 'TROPA', 'CARNE', 'HUMEDAD', 'TECLA', 'MALETIN', 'CUCHILLO', 'RELOJ', 'RADIO', 'CELULAR', 'CUADRO', 'CALOR', 'TEATRO', 'DISCURSO', 'FIESTA']

let palabraSecreta;
let palabraSecretaRestante;
let fallos = 0;

let juegoActivo = false;
let letrasErroneas = [];



//--------------------------------------------------------------------------//
//---------------------------Letras-----------------------------------------//
//--------------------------------------------------------------------------//

window.addEventListener('keydown', registrarTeclas)

function registrarTeclas(event){
    if(juegoActivo){
        if(esTeclaDeLetra(event.keyCode)){
            let letraIngresada = String.fromCharCode(event.keyCode).toUpperCase();
            
            let letraEncontrada = false;
            for(var i = 0; i < palabraSecreta.length; i++){
                if(palabraSecreta.charAt(i) == letraIngresada){
                    letraEncontrada = true;
                    if(palabraSecretaRestante.includes(letraIngresada)){
                        
                        //Busco el contenedor de dicha letra.
                        let contenedor = document.querySelector('#hidden-letters-container :nth-child('+ (i+1) +')')
                        contenedor.innerHTML = letraIngresada
                        //borro la letra de la cadena restante
                        let posicionLetra = palabraSecretaRestante.indexOf(letraIngresada)
                        palabraSecretaRestante = palabraSecretaRestante.slice(0,posicionLetra) + palabraSecretaRestante.slice(posicionLetra+1)
                        console.log(palabraSecretaRestante)
                        //Checkeo victoria
                        if(palabraSecretaRestante == ''){
                            juegoActivo = false;
                            alert("Ganaste!")
                        }
                    }    
                }
            }
            if(!letraEncontrada && !letrasErroneas.includes(letraIngresada)){
                letrasErroneas.push(letraIngresada) //Agrego la letra ingresada a las erroneas
                let letra = document.createElement("div") //Creo div
                letra.innerHTML = letraIngresada //Agrego contenido al div
                //Busco el contenedor y agrego a la letra como hijo.
                let contenedor = document.querySelector('#wrong-letters-container'); 
                contenedor.appendChild(letra)
                fallos++
                
                //Agrego un fallo y dibujo la horca correspondiente.
                if(fallos >= 6){
                    juegoActivo = false;
                    alert("Perdiste el juego.")
                }
                dibujarCanvas(fallos)
            }
        }
    }
}

function esTeclaDeLetra(keycode){
    return (keycode >= 65 && keycode <= 90) || (keycode >= 975 && keycode <= 122)
}


//--------------------------------------------------------------------------//
//---------------------------Botones----------------------------------------//
//--------------------------------------------------------------------------//

function iniciarJuego(){
    palabraSecreta = getPalabraSecreta();
    palabraSecretaRestante = palabraSecreta;
    console.log(palabraSecreta)
    mostrarGame(palabraSecreta)
}

function agregarNuevaPalabra(){
    mostrarWordEntry()
}

function iniciarJuegoConPalabra(){
    palabraIngresada = document.getElementById('newWord').value.toString().toUpperCase();
    
    if(esPalabraValida(palabraIngresada)){
        palabraSecreta = palabraIngresada
        palabraSecretaRestante = palabraSecreta;
        diccionario.push(palabraSecreta)
        console.log(palabraSecreta)
        mostrarGame(palabraSecreta)
    } else {
        alert("Palabra ingresada invalida. Solo se aceptan palabras de hasta 8 digitos y solo letras.")
    }
}

function cancelarWordEntry(){
    mostrarMenu()
}

function rendirse(){
    juegoActivo = false
    mostrarMenu()
}

function reiniciarJuego(){
    palabraSecreta = getPalabraSecreta();
    palabraSecretaRestante = palabraSecreta;
    console.log(palabraSecreta)
    mostrarGame(palabraSecreta)
    
}


document.getElementById("btn-start").onclick = iniciarJuego;
document.getElementById("btn-wordEntry").onclick = agregarNuevaPalabra;
document.getElementById("btn-startWithWord").onclick = iniciarJuegoConPalabra;
document.getElementById("btn-cancelWordEntry").onclick = cancelarWordEntry;
document.getElementById("btn-forfeit").onclick = rendirse;
document.getElementById("btn-newGame").onclick = reiniciarJuego;


//--------------------------------------------------------------------------//
//---------------------------Palabra Secreta--------------------------------//
//--------------------------------------------------------------------------//

// Devuelve el valor de una posicion aleatoria de diccionario, entre 0 y su longitud-1
function getPalabraSecreta(){
    return diccionario[Math.floor(Math.random() * diccionario.length )]
}

function esPalabraValida(palabra){
    return (palabra.length>= 1 && palabraIngresada.length <= 8 && tieneSoloLetras(palabra))
}

function tieneSoloLetras(palabra){
    return /^[A-Za-z]*$/.test(palabra);
}

function generarLineasDeLetras(palabra){
    document.getElementById('hidden-letters-container').innerHTML = ""; //Limpio los hijos del contenedor
    for(var i = 0; i<palabra.length; i++){
        let letra = document.createElement("div") //Creo div
        document.getElementById('hidden-letters-container').appendChild(letra); //Pongo el div como hijo del contenedor
    }
}

//--------------------------------------------------------------------------//
//---------------------------Canvas-----------------------------------------//
//--------------------------------------------------------------------------//

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");    
ctx.lineWidth = 5;
ctx.strokeStyle = "#0A3871";

function reiniciarCanvas(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
}


//dibujarCanvas
//dibuja la horca con 0 fallos, y por cada fallo dibuja otra parte del cuerpo.
function dibujarCanvas(fallos){
    switch(fallos){
        case 0: //dibujar horca
            ctx.beginPath();
            ctx.moveTo(350, 450);
            ctx.lineTo(650, 450);
            ctx.moveTo(400,450)
            ctx.lineTo(400,100)
            ctx.lineTo(600,100)
            ctx.lineTo(600,150)
            ctx.stroke()
            break;

        case 1:  //dibujar cabeza
            ctx.beginPath()
            ctx.arc(600, 175, 25, 0, 2* Math.PI)
            ctx.stroke()
            break;

        case 2: //dibujar cuerpo
            ctx.beginPath()
            ctx.moveTo(600,200)
            ctx.lineTo(600,325)
            ctx.stroke() 
            break;

        case 3:  //brazo izquierdo
            ctx.beginPath()
            ctx.moveTo(600,220)
            ctx.lineTo(560,275)
            ctx.stroke()
            break;

        case 4: //brazo derecho
            ctx.beginPath()
            ctx.moveTo(600,220)
            ctx.lineTo(640,275)
            ctx.stroke()
            break;

        case 5: //pierna izquierda
            ctx.beginPath()
            ctx.moveTo(600,325)
            ctx.lineTo(560,400)
            ctx.stroke()
            break;

        case 6: //pierna derecha
            ctx.beginPath()
            ctx.moveTo(600,325)
            ctx.lineTo(640,400)
            ctx.stroke()
            break;      
    }
    
}

//--------------------------------------------------------------------------//
//---------------------------Secciones--------------------------------------//
//--------------------------------------------------------------------------//

let seccionMenu = document.getElementById('menu')
let seccionGame = document.getElementById('game')
let seccionWordEntry = document.getElementById('word-entry')

function mostrarMenu(){
    seccionMenu.style.display = 'flex';
    seccionGame.style.display = 'none';
    seccionWordEntry.style.display = 'none';
}

function mostrarGame(palabraSecreta){
    seccionMenu.style.display = 'none';
    seccionGame.style.display = 'flex';
    seccionWordEntry.style.display = 'none';

    //reinicio globales
    juegoActivo = true
    letrasErroneas = []
    fallos = 0;
    letrasAcertadas = 0;
    //reinicio los contenedores
    document.getElementById('hidden-letters-container').innerHTML = ""
    document.getElementById('wrong-letters-container').innerHTML = ""

    //reinicio canvas
    reiniciarCanvas()

    dibujarCanvas(fallos);
    generarLineasDeLetras(palabraSecreta);
}

function mostrarWordEntry(){
    seccionMenu.style.display = 'none';
    seccionGame.style.display = 'none';
    seccionWordEntry.style.display = 'flex';
}