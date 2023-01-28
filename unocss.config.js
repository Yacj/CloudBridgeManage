import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    presetWebFonts
} from 'unocss'
import transformerDirective from '@unocss/transformer-directives'

export default defineConfig({
    shortcuts: [
        ['flex-center', 'flex justify-center items-center'],
        ['flex-center-end', 'flex justify-end items-center']
    ],
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            scale: 1.2,
            warn: true
        }),
        presetTypography(),
        presetWebFonts({
            fonts: {
                sans: 'DM Sans',
                serif: 'DM Serif Display',
                mono: 'DM Mono'
            }
        })
    ],
    transformers: [
        transformerDirective()
    ]
})
