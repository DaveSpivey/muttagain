class MuttsController < ApplicationController
  helper ReactHelper

  before_action :set_mutt, only: [:show, :edit, :update, :destroy]

  def index
    @breeds = Breed.all
    @mutts = Mutt.all
    @photos = Photo.where(profile: true)
    @slides = []
    
    if @photos.empty?
      flash[:error] = "No mutt photos!"
    else
      mutts = {}
      
      @slides = @photos.map do |pic|
        mutt = Mutt.find(pic.mutt_id)
        guessed_breeds = {}
        mutt.guesses.each do |guess|
          breed = Breed.find(guess.breed_id)
          if !guessed_breeds.has_key? breed.name
            guessed_breeds[breed.name] = {
              link: breed.link,
              frequency: 1
            }
          else
            guessed_breeds[breed.name][:frequency] += 1
          end
        end

        { 
          photoId: pic.id, 
          photoUrl: pic.image.url(:large), 
          muttId: mutt.id, 
          muttName: mutt.name, 
          muttGuesses: guessed_breeds 
        }
      end
    end

    respond_to do |format|
      format.html
      format.js
      # format.json { render json: mutts }
    end
  end

  def show
    @user = current_user
    @photos = @mutt.photos.map do |photo|
      {
        id: photo.id, 
        mutt_id: photo.mutt_id, 
        profile: photo.profile, 
        smallUrl: photo.image.url(:small), 
        mediumUrl: photo.image.url(:medium), 
        largeUrl: photo.image.url(:large)
      }
    end
  end

  def edit
  end

  def create
    @mutt = Mutt.new(mutt_params)

    respond_to do |format|
      if @mutt.save
        format.json { render json: @mutt }
      else
        format.json { render json: @mutt.errors }
      end
    end
  end

  def update
    @mutt.name = params[:muttName]
    if @mutt.save
      render json: { muttName: params[:muttName] }
    else
      render :json => { :errors => @mutt.errors }
    end
  end

  def destroy
  end

  private

  def set_mutt
    @mutt = Mutt.find(params[:id])
  end

  def mutt_params
    params.require(:mutt).permit(:name, :owner_id)
  end
end
