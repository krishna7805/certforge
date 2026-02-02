// fontLoader.js
const fontLoader = {
    fonts: [
        { name: 'Inter', weights: ['Regular', 'SemiBold', 'Bold'] },
        { name: 'Playfair Display', weights: ['Regular', 'SemiBold', 'Bold'] },
        { name: 'Dancing Script', weights: ['Regular', 'SemiBold', 'Bold'] }
    ],

    loadFonts: function() {
        const promises = this.fonts.map(font => {
            return Promise.all(font.weights.map(weight => {
                return this.loadFont(font.name, weight);
            }));
        });

        return Promise.all(promises).then(() => {
            console.log('All fonts loaded');
        });
    },

    loadFont: function(name, weight) {
        return new Promise((resolve, reject) => {
            const fontFace = new FontFace(name, `url('../fonts/${name.toLowerCase().replace(/ /g, '-')}/${name}-${weight}.woff2')`, { weight });
            fontFace.load().then(() => {
                document.fonts.add(fontFace);
                resolve();
            }).catch(reject);
        });
    }
};

// Ensure fonts are loaded before rendering text
document.fonts.ready.then(() => {
    console.log('Fonts are ready to use');
});

export default fontLoader;