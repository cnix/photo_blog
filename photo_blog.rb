# Required Gems
%w(rubygems sinatra haml sass).each {|d| require d}

# Flickr API key
# 9c9a2608064330707e0efd8b6816510b
# secret
# 8a3d673c9f76d1ec

layout 'layout.haml'

get '/' do
  haml :index
end

get '/day/:number' do
  haml :permalink
end

get '/stylesheet.css' do
  headers 'Content-Type' => 'text/css; charset=utf-8'
  sass :stylesheet
end

helpers do
  
end