# Required Gems
%w(rubygems sinatra haml sass).each {|d| require d}

layout 'layout.haml'

get '/' do
  haml :index
end

get '/day/:number' do
  haml :permalink
end

get '/about' do
  haml :about
end

get '/stylesheet.css' do
  headers 'Content-Type' => 'text/css; charset=utf-8'
  sass :stylesheet
end

helpers do
  
end