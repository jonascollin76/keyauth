const { SlashCommandBuilder, Colors } = require("discord.js");
const db = require('quick.db')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("upload")
        .setDescription("Upload a file")
        .setDescriptionLocalizations({
            "en-US": "Upload a file",
            "fi": "Lataa tiedosto",
            "fr": "Télécharger un fichier",
            "de": "Lade eine Datei hoch",
            "it": "Carica un file",
            "nl": "Upload een bestand",
            "ru": "Загрузить файл",
            "pl": "Prześlij plik",
            "tr": "Bir dosya yükle",
            "cs": "Nahrát soubor",
            "ja": "ファイルをアップロードする",
            "ko": "파일 업로드",
        })
        .addStringOption((option) => 
        option
            .setName("url")
            .setDescription("File URL what you want to upload")
            .setDescriptionLocalizations({
                "en-US": "File URL what you want to upload",
                "fi": "Tiedoston URL, jonka haluat ladata",
                "fr": "URL du fichier que vous souhaitez télécharger",
                "de": "Datei-URL, die Sie hochladen möchten",
                "it": "URL del file che desideri caricare",
                "nl": "Bestands-URL die u wilt uploaden",
                "ru": "URL-адрес файла, который вы хотите загрузить",
                "pl": "Adres URL pliku, który chcesz przesłać",
                "tr": "Yüklemek istediğiniz dosya URL'si",
                "cs": "URL souboru, který chcete nahrát",
                "ja": "アップロードしたいファイルのURL",
                "ko": "업로드 할 파일 URL",
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

        let url = interaction.options.getString("url")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=upload&url=${url}`)
        .then(res => res.json())
        .then(json => {
        if(json.success)
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral})
        }
        else
        {
            interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral})
        }
        })
    },
};