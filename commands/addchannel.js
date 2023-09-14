const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addchannel")
        .setDescription("Add chat channel")
        .setDescriptionLocalizations({
            "en-US": "Add chat channel",
            "fi": "Lisää keskustelukanava",
            "fr": "Ajouter un canal de discussion",
            "de": "Chatkanal hinzufügen",
            "it": "Aggiungi canale di chat",
            "nl": "Voeg chatkanaal toe",
            "ru": "Добавить чат-канал",
            "pl": "Dodaj kanał czatu",
            "tr": "Sohbet kanalı ekle",
            "cs": "Přidat chatovací kanál",
            "ja": "チャットチャネルを追加する",
            "ko": "채팅 채널 추가"
        })
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("Chat channel name")
            .setDescriptionLocalizations({
                "en-US": "Chat channel name",
                "fi": "Keskustelukanavan nimi",
                "fr": "Nom du canal de discussion",
                "de": "Name des Chatkanals",
                "it": "Nome del canale di chat",
                "nl": "Naam van chatkanaal",
                "ru": "Имя чат-канала",
                "pl": "Nazwa kanału czatu",
                "tr": "Sohbet kanalı adı",
                "cs": "Název chatovacího kanálu",
                "ja": "チャットチャネル名",
                "ko": "채팅 채널 이름"
            })
            .setRequired(true)
        )
        .addStringOption((option) => 
        option
            .setName("delay")
            .setDescription("Chat channel delay (how often user can send messages in seconds)")
            .setDescriptionLocalizations({
                "en-US": "Chat channel delay (how often user can send messages in seconds)",
                "fi": "Keskustelukanavan viive (kuinka usein käyttäjä voi lähettää viestejä sekunneissa)",
                "fr": "Délai du canal de chat (fréquence des messages en secondes)",
                "de": "Chatkanalverzögerung (wie oft der Benutzer Nachrichten in Sekunden senden kann)",
                "it": "Ritardo del canale di chat (con quale frequenza l'utente può inviare messaggi in secondi)",
                "nl": "Chatkanaalvertraging (hoe vaak gebruiker berichten kan verzenden in seconden)",
                "ru": "Задержка чат-канала (как часто пользователь может отправлять сообщения в секундах)",
                "pl": "Opóźnienie kanału czatu (jak często użytkownik może wysyłać wiadomości w sekundach)",
                "tr": "Sohbet kanalı gecikmesi (kullanıcı ne sıklıkla mesaj gönderebileceği saniye cinsinden)",
                "cs": "Zpoždění chatovacího kanálu (jak často může uživatel odesílat zprávy v sekundách)",
                "ja": "チャットチャネルの遅延（ユーザーが秒単位でメッセージを送信できる頻度）",
                "ko": "채팅 채널 지연 (사용자가 초 단위로 메시지를 보낼 수 있는 빈도)"
            })
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		let ephemeral = true;
		
		if(interaction.guild == null) {
			idfrom = interaction.user.id;
			ephemeral = false;
		}
		else {
			idfrom = interaction.guild.id;
		}
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})

        let name = interaction.options.getString("name")
        let delay = interaction.options.getString("delay")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=addchannel&name=${name}&delay=${delay}`)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "KeyAuth Discord Bot" })], ephemeral: ephemeral})
            }
        })
    },
};