import type { PlaygroundInputType } from '@/types';

export const TOKENS_PRESET = `{
  "color": {
    "$type": "color",
    "white": { "$value": "#ffffff" },
    "black": { "$value": "#000000" },
    "gray": {
      "100": { "$value": "#f4f4f5" },
      "200": { "$value": "#e4e4e7" },
      "500": { "$value": "#71717a" },
      "700": { "$value": "#3f3f46" },
      "800": { "$value": "#27272a" },
      "900": { "$value": "#18181b" }
    },
    "blue": {
      "400": { "$value": "#60a5fa" },
      "600": { "$value": "#2563eb" }
    }
  },
  "size": {
    "$type": "dimension",
    "4": { "$value": { "value": 4, "unit": "px" } },
    "8": { "$value": { "value": 8, "unit": "px" } },
    "16": { "$value": { "value": 16, "unit": "px" } },
    "24": { "$value": { "value": 24, "unit": "px" } },
    "32": { "$value": { "value": 32, "unit": "px" } },
    "48": { "$value": { "value": 48, "unit": "px" } }
  },
  "rounded": {
    "$type": "dimension",
    "sm": { "$value": "{size.4}" },
    "md": { "$value": "{size.8}" },
    "lg": { "$value": "{size.16}" },
    "full": { "$value": { "value": 999, "unit": "px" } }
  },
  "font": {
    "family": {
      "$type": "fontFamily",
      "sans": { "$value": ["Inter", "sans-serif"] },
      "mono": { "$value": ["JetBrains Mono", "monospace"] }
    },
    "weight": {
      "$type": "fontWeight",
      "regular": { "$value": 400 },
      "bold": { "$value": 700 }
    },
    "leading": {
      "$type": "number",
      "tight": { "$value": 1.25 },
      "normal": { "$value": 1.5 }
    },
    "size": {
      "$type": "dimension",
      "16": { "$value": "{size.16}" },
      "24": { "$value": "{size.24}" },
      "32": { "$value": "{size.32}" },
      "48": { "$value": "{size.48}" }
    },
    "h48": {
      "$type": "typography",
      "$value": {
        "fontSize": "{font.size.48}",
        "lineHeight": "{font.leading.tight}",
        "fontWeight": "{font.weight.bold}"
      }
    },
    "h32": {
      "$type": "typography",
      "$value": {
        "fontSize": "{font.size.32}",
        "lineHeight": "{font.leading.tight}",
        "fontWeight": "{font.weight.bold}"
      }
    },
    "t16": {
      "$type": "typography",
      "$value": {
        "fontSize": "{font.size.16}",
        "lineHeight": "{font.leading.normal}",
        "fontWeight": "{font.weight.regular}"
      }
    }
  },
  "shadow": {
    "$type": "shadow",
    "card": {
      "$value": [
        { "color": "#0000001a", "offsetX": "0px", "offsetY": "1px", "blur": "2px", "spread": "0px" },
        { "color": "#0000001a", "offsetX": "0px", "offsetY": "4px", "blur": "12px", "spread": "-2px" }
      ]
    }
  },
  "screen": {
    "$type": "dimension",
    "md": {
      "min": { "$value": { "value": 769, "unit": "px" } },
      "max": { "$value": { "value": 1024, "unit": "px" } }
    },
    "lg": {
      "min": { "$value": { "value": 1025, "unit": "px" } }
    }
  },
  "animation": {
    "show": { "$value": "show 300ms ease-in forwards" }
  },
  "keyframes": {
    "$type": "number",
    "show": {
      "from": { "opacity": { "$value": 0 } },
      "to": { "opacity": { "$value": 1 } }
    }
  }
}
`;

export const LIGHT_PRESET = `{
  "color": {
    "$type": "color",
    "background": { "$value": "{color.white}" },
    "foreground": { "$value": "{color.gray.900}" },
    "muted": { "$value": "{color.gray.100}" },
    "border": { "$value": "{color.gray.200}" },
    "primary": { "$value": "{color.blue.600}" }
  }
}
`;

export const DARK_PRESET = `{
  "color": {
    "$type": "color",
    "background": { "$value": "{color.gray.900}" },
    "foreground": { "$value": "{color.gray.100}" },
    "muted": { "$value": "{color.gray.800}" },
    "border": { "$value": "{color.gray.700}" },
    "primary": { "$value": "{color.blue.400}" }
  }
}
`;

export const TAILWIND_V4_CONFIG_PRESET = `{
  "themeAliases": {
    "font": "font/family",
    "font-weight": "font/weight",
    "leading": "font/leading",
    "text": "font/size",
    "color": "color",
    "spacing": "1px",
    "radius": "rounded",
    "shadow": "shadow",
    "breakpoint": "screen",
    "animation": "animation",
    "keyframes": "keyframes"
  },
  "themes": { "default": "light", "prefix": "theme" }
}
`;

export const TAILWIND_V3_CONFIG_PRESET = `{
  "themeAliases": {
    "fontFamily": "font/family",
    "fontWeight": "font/weight",
    "lineHeight": "font/leading",
    "fontSize": "font/size",
    "colors": "color",
    "screens": "screen",
    "borderRadius": "rounded",
    "extend": {
      "boxShadow": "shadow",
      "animation": "animation",
      "keyframes": "keyframes"
    }
  },
  "themes": { "default": "light" }
}
`;

export const MIXIN_CONFIG_PRESET = `{
  "platforms": ["css", "scss", "less"],
  "mediaAliases": ["screen"],
  "keyframesAliases": ["keyframes"],
  "themes": { "default": "light" }
}
`;

export function getConfigPreset({
  packageName,
  tailwindVersion,
}: Pick<PlaygroundInputType, 'packageName' | 'tailwindVersion'>) {
  if (packageName === 'mixin-dictionary') return MIXIN_CONFIG_PRESET;
  return tailwindVersion === 3 ? TAILWIND_V3_CONFIG_PRESET : TAILWIND_V4_CONFIG_PRESET;
}
