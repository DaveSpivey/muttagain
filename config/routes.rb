Rails.application.routes.draw do
  
  root 'mutts#index'

  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  get '/logout' => 'sessions#destroy'

  get '/signup' => 'users#new'
  post '/users' => 'users#create'

  resources :users

  resources :mutts do
    resources :photos
    resources :guesses
  end

  resources :adoptables
  
end
