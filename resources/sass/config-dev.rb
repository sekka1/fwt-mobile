# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

# Load the sencha-touch framework automatically.
load File.join(dir, '..', '..', 'sdk', 'resources', 'themes')

# Compass configurations
sass_path = dir
css_path = File.join(dir, "..", "css")
images_dir = File.join(dir, "..", "images")
http_images_path = '../images'

# Require any additional compass plugins here.
output_style = :expanded
environment = :development

# Load retina helpers
retina_ext = File.join(File.dirname(__FILE__), 'retina')
require File.join(retina_ext, 'lib', 'sass_extensions.rb')
add_import_path File.join(retina_ext, 'stylesheets')