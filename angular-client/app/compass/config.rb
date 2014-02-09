# test
project_path = File.expand_path("..",File.dirname(__FILE__))

# Require any additional compass plugins here.
require "susy"
# require "modular-scale"
# require "sassy-buttons"
# require "animation"

# Set this to the root of your project when deployed:
http_path       = "/"
css_dir         = "css"
sass_dir        = "css-src"
images_dir      = "template-assets"
javascripts_dir = "js"
fonts_dir       = "fonts"

# output_style  = :compressed
# output_style  = :compact
# output_style  = :nested
output_style    = :expanded
# environment     = :production
environment   = :development

# sass_options = { :sourcemap => true }

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false
color_output    = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass css-src scss && rm -rf sass && mv scss sass
preferred_syntax = :scss
