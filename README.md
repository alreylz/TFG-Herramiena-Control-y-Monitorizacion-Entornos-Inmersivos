<img height="100" src="C:\Users\cored\Desktop\Github\ixci-grpc\client\static\images\IXCI-icon.png" width="200"/>

# The Immersive eXperimenter Control Interface (gRPC Version)

The Immersive eXperimentar Control Interface is a research support application aimed at facilitating the remote control
of XR HCI experiments in standalone devices that
use Unity.

With IXCI researchers can focus on designing an experiment and easily add ah-hoc remote control functionality without
writing any network communication code.
IXCI generates the all the boilerplate code required for network communication (leveraging GRPC and proto3) and
researchers just need to implement the actual functionality in the XR Unity application and link that to the
autogenerated stubs.
Then, researchers are ready to configure and manage the lifecycle of an experiment XR from the web, where they can
execute their functions on demand..

It enables:

1. The definition of functions that are to be executed in a given Head Mounted Display running a Unity
   application without the need to write any code

## Features

- Definition of remote procedure calls via UI.
- Execution of the procedure calls on a device, posibility to control several experiments simultaneously.
- Researcher accounts (different users can set up different sets of functions and use them for different experiments)

## Limitations

- Only supports UNARY RPCs NO support for bidirectional RPCs.
- Only works in LAN (since the RPC server runs in the Unity application).

# Main Contributors

[**Alejandro Rey López**](http://alreylz.me) (Javascript Front and backend development, Unity package development)

[**Jesús Albarca Gordillo**](https://jesusalbarca.es/) (Initial prototype development, BsC. Thesis Student)

## Getting started

## In IXCI

1. Run the web application.
2. Create an account and log in.
3. The web application allows you to define your remote functions using a GUI.

   To do so, you need to define several elements:

    - `Messages` These will be used to exchange the required information that the remotely controlled end will need to
      achieve its goal.
    - `RPCs` (these are the functions themselves, to which we give a name that makes sense for us).
      (these constitute the parameters and return types of functions).
    - `Services` Related RPCs need to be grouped under a name, which is called a service. You will need to declare at
      least a service that contains the RPCs you want to use in your experiment.
    - `Packages` A package can be thought of as a container related remote control functionality.
      Most likely, you wil want to have **one package per experiment**.

After the creation of the definition of the elements of the remote calls, a .proto file is generated, which is to be
shared with the receiving end. This file can be compiled in the receiving end (E.g., a Unity VR application) and code
for the target programming language will be automatically generated.

After that, all that is left to do is to define the actual desired behaviour of the remote calls and binding the
implementation with the auto-generated code.

Once all of this is done, we can call the functions from the "Execute Services" panel.

## In Unity

1. Download the IXCI-integration package
2. S

# Endpoints

# Working on

## Imprescindibles

- Crear un servicio que permita pasar el id del participante
- Crear un servicio que permita configurar el orden de presentación de las condiciones experimentales.
- Botón de terminar el experimento
- Que el botón de eliminar te pida confirmación
- Evitar que se sobreescriba el archivo proto.
- Añadir un campo a los mensajes en base de datos que indique si un mensaje es complejo o no.

## Features in the roadmap

- Permitir cambiar nombre del paquete generado desde GUI /Configurar en general desde la GUI
- No se tienen en cuenta las dependencias entre servicios/mensajes/rpcs
- No envía correctamente booleans (sale siempre true) -> ARREGLADO
- Cada vez que se ejecuta un servicio, vuelve al home !!!  (arreglado)
- Permitir duplicar protofile
- Permitir especificar el nombre del paquete desde la GUI o desde línea de comandos.
- no crear archivo proto si es igual al que ya existe.
- Ya lee del protofile.proto (lo único que hay que reiniciar el server)
- Support streaming

## Reminders

Ejecutar el watcher de Sass para compilar los estilos:<br/>
`sass --watch client/style/scss:client/style/css`

Generar automáticamente la documentación: <br/>
`jsdoc ./src/ --readme ./README.md -P ./package.json -r -d ./docs`
