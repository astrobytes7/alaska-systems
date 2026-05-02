const {
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    SectionBuilder,
} = require("discord.js");

module.exports = {
    name: "verify",
    description: "Sends the verification panel.",
    async execute(message) {
        await message.delete();

        const components = [
            new ContainerBuilder()
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems(
                        new MediaGalleryItemBuilder().setURL(
                            "https://media.discordapp.net/attachments/1400662781216296960/1500210909094744134/image.png?ex=69f79bc9&is=69f64a49&hm=2f7e84472627bbe430bca1d64236e42491ac578d9aafc4233c34dde1b9ce1bd1&=&format=webp&quality=lossless&width=2834&height=849"
                        )
                    )
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### Verification Panel")
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "At **Alaska State Roleplay**, we use **Dock Systems** to verify users. In order to gain access to the rest of the server, you must verify your Roblox account. Please click the **verification** button below this message to get started in the verification process."
                    )
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setDivider(true)
                        .setSpacing(SeparatorSpacingSize.Small)
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "Verify using the button here:"
                            )
                        )
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setCustomId("start-verify")
                                .setLabel("Begin Verification")
                                .setStyle(ButtonStyle.Secondary)
                        )
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems(
                        new MediaGalleryItemBuilder().setURL(
                            "https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194"
                        )
                    )
                ),
        ];

        await message.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components,
        });
    },
};
