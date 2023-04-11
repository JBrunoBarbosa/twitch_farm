document.addEventListener('DOMContentLoaded', function() {
    const liveContainer = document.querySelector('.live-container');
    const names = []
    
    addUserModal()
    addStreamerModal()
  
    function createCard(name) {
        const card = document.createElement('div');
        card.classList.add('card');
  
        const streamerName = document.createElement('div');
        streamerName.classList.add('streamer-name');
        streamerName.innerText = truncateText(name, 23);
        card.appendChild(streamerName);
    
        const farmTime = document.createElement('div');
        farmTime.classList.add('points');
        farmTime.innerText = `Tempo conectado: 0h 0min`;
        card.appendChild(farmTime);
    
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');
        card.appendChild(buttonsContainer);
    
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.innerText = 'Remover';
        removeButton.addEventListener('click', function() {
            card.remove();
            names.splice(names.indexOf(name), 1);
        });
        buttonsContainer.appendChild(removeButton);
    
        const chatButton = document.createElement('button');
        chatButton.classList.add('chat-button');
        chatButton.addEventListener('click', function() {
            openTwitchChat(name);
        });
        chatButton.innerText = 'Chat';
        buttonsContainer.appendChild(chatButton);
    
        const pointsButton = document.createElement('button');
        pointsButton.classList.add('points-button');
        pointsButton.innerText = 'Pontos';
        pointsButton.addEventListener('click', function() {
            openStreamElements(name);
        });
        buttonsContainer.appendChild(pointsButton);
    
        // Define o tempo de início
        let startTime = new Date();
    
        // Adiciona um intervalo de 10 segundos para atualizar o tempo conectado
        let timeInterval = setInterval(() => {
            let currentTime = new Date();
            let diffTime = currentTime - startTime; // Calcula a diferença de tempo em milissegundos
            let hours = Math.floor(diffTime / (1000 * 60 * 60)); // Calcula as horas
            let minutes = Math.floor((diffTime / (1000 * 60)) % 60); // Calcula os minutos
            farmTime.innerText = `Tempo conectado: ${hours}h ${minutes}min`; // Atualiza o texto do tempo conectado
        }, 10000);
  
      return card;
    }

    function addStreamerModal() {
        const addStreamerModal = document.querySelector('.add-streamer-modal');
        const addStreamerBtn = document.querySelector('#add-streamer');
        const addStreamerCloseBtn = addStreamerModal.querySelector('.close');
        const addStreamerSaveBtn = addStreamerModal.querySelector('#streamer-save-btn');
    
        // Abre o modal quando o usuário clica no botão Add Streamer
        addStreamerBtn.addEventListener('click', function() {
            addStreamerModal.style.display = 'flex';
        });
    
        // Fecha o modal quando o usuário clica no botão X ou fora do modal
        addStreamerCloseBtn.addEventListener('click', function() {
            addStreamerModal.style.display = 'none';
        });

        // Salva o nome do streamer
        addStreamerSaveBtn.addEventListener('click', function() {
            event.preventDefault();
  
            const streamerLink = document.getElementById('streamer-name').value;
            
            // Extrai o nome do canal da URL do streamer
            const channelName = streamerLink.split('/')[3];
    
            // Adiciona o novo streamer usando a função createCard() ou qualquer outra lógica necessária.
            if(!names.includes(channelName)){
                liveContainer.appendChild(createCard(channelName));
                names.push(channelName)
            }

            addStreamerModal.style.display = 'none';
        });
                
        document.getElementById('add-streamer').addEventListener('click', function() {
            addStreamerModal.style.display = 'flex';
        });
    }
    
    function addUserModal(){
        const modal = document.querySelector('.modal');
        const closeBtn = document.querySelector('.close');
        const addStreamerSaveBtn = modal.querySelector('#user-save-btn');
        
        modal.style.display = 'flex';

        // Abre o modal quando o usuário clica no botão Change User
        document.getElementById('change-user').addEventListener('click', function() {
          modal.style.display = 'flex';
        });

        addStreamerSaveBtn.addEventListener('click', function() {
            event.preventDefault();
  
            const userName = document.getElementById('twitch-user').value;
            const userOauth = document.getElementById('oauth-token').value;
            const userClientId = document.getElementById('client-id').value;
            document.getElementById('user-name').innerText = '@'+ userName;

            twitchLogin(userName, userOauth, userClientId)

            modal.style.display = 'none';
        });
        
        // Fecha o modal quando o usuário clica no botão X ou fora do modal
        closeBtn.addEventListener('click', function() {
          modal.style.display = 'none';
        });

    }

    // Função para realizar o login na Twitch via OAuth
    function twitchLogin(twitchUser, accessToken, clientId) {
        const options = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Client-Id": clientId
          }
        };
        
        return fetch(`https://api.twitch.tv/helix/users?login=${twitchUser}`, options)
        .then(response => response.json())
        .then(data => {
            return data.data[0].id;
        })
        .catch(error => {
            console.error(error);
            return null;
        });
    }
    
    // Função para abrir o chat de um canal na Twitch
    function openTwitchChat(channelName) {
        const chatUrl = `https://www.twitch.tv/${channelName}/chat`;
        const chatWindow = window.open(chatUrl, 'Twitch Chat', 'height=600,width=400');
        if (chatWindow.focus) {
            chatWindow.focus();
        }
    }

    // Função para abrir a loja e os pontos
    function openStreamElements(channelName) {
        const chatUrl = `https://streamelements.com/${channelName}/store`;
        const chatWindow = window.open(chatUrl, 'Twitch Chat', 'height=600,width=400');
        if (chatWindow.focus) {
            chatWindow.focus();
        }
    }

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength - 3) + '...';
        } else {
          return text;
        }
      }
    
});

