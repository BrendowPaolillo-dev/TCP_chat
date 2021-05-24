# Descrição Chat

O projeto de sistemas distribuídos é descrito como um chat em grupo ou privado que possui um sistema de envio de arquivos.

## Arquitetura

A arquitetura do sistema é baseada em cliente servidor. A conexão é estabelecida por um *WebSocket*, visando aumentar a performance entre a troca de mensagens, temos então uma via bidirecional entre os clientes e o servidor, por mais que ela não esteja sendo utilizada.

Para a compreensão do fluxo de mensagens o diagrama e a descrição abaixo demonstram numericamente a conexão do *Client 1* ao sistema de chat, recebe a lista de usuários conectados, realiza o envio de uma mensagem privada, um download, envia uma mensagem pública e encerra a conexão, já os demais clientes estavam conectados ao sistema e permaneceram. **

![Arquitetura_Chat - Brendow e Lucas](https://user-images.githubusercontent.com/7331149/119402094-d0e80800-bcb2-11eb-8384-1a5c06f274b6.jpg)

1. join( ): *Client 1* realiza a conexão ao servidor;
2. connection( ): Servidor retorna a conexão com o cliente ao chat.
3. getUserList( ): *Client 1* requisita os nomes dos clientes conectados ao sistema.
4. return getUserList( ): Servidor retorna um vetor de nomes.
5. manageMessage( ): *Client 1* envia o pedido de gerenciamento da mensagem para o servidor, esperando que seja tratada e enviada ao destinatário. (Caso a mensagem for pública ela terá um cabeçalho diferente da privada)
6. message( ): Servidor envia a mensagem ao destinatário.
7. sendFile( ): *Client 2* envia um arquivo ao servidor.
8. downloadFile( ): *Client 1* realiza o download do arquivo.
9. manageMessage( ): *Client 1* envia uma mensagem pública.
10. message( ): Clientes recebem a mensagem pública.
11. closeConnection( ): *Client 1* encerra a conexão com o servidor

## Funcionalidades

- Os usuários poderão se conectar através da Internet;
- O servidor realizará o intermédio entre a troca de mensagens, realizando o empacotamento e endereçamento das mensagens;
- O cliente não terá acesso aos dados dos clientes externos;
- O cliente se cadastra e realiza o contato com outros por meio de nicks;
- O servidor pode criar uma sala de grupo;
- É possível realizar a troca de arquivos entre os usuários.

## Tecnologias

Para a implementação do chat serão utilizadas as seguintes tecnologias:

- ReactJS: Para o desenvolvimento do frontend e página web;
- Websockets: Realiza a comunicação para troca de mensagens entre o cliente e o servidor, assim aumentando o desempenho por reduzir o número de requisições.

## Interface

- Object join ( ): Notifica a entrada de um novo usuário ao chat para o cliente, exibe uma mensagem de entrada com o nome do usuário que foi conectado no lado esquerdo do chat.

    Pode retornar um objeto Error( ) caso não tenha conseguido estabelecer a conexão.

- Void closeConnection ( ): Notifica a saída de um usuário do chat para o cliente, exibe uma mensagem de saída com o nome do usuário que foi desconectado no lado esquerdo do chat.

- Array getUserList ( ): Requisita uma lista com todos os usuários do chat, exceto o usuário que enviou essa requisição, necessário para envio das mensagens privadas, para sempre ter a lista de usuários possíveis atualizada.

    return um Array de Strings.

- Void sendFile ( ): Envia um arquivo para o servidor encaminha-lo para os outros clientes.

- HTML downloadFile ( File file, String sender ): Exibe um link de download de um arquivo recebido do servidor.

    return Tag html com o arquivo para download.

- Void manageMessage([ Integer code, String sender, String text, String destination, File file ]): Recebe e gerencia o tratamento das mensagens enviadas pelo servidor. Exibe mensagens enviadas por outros clientes, tais como textos ou arquivos e notifica o chat do cliente que um cliente novo entrar no chat ou quando ele sair.