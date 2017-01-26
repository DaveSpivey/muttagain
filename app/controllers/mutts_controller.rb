class MuttsController < ApplicationController
  helper ReactHelper

  before_action :set_mutt, only: [:show, :edit, :update, :destroy]

  def index
    @breeds = Breed.all
    @mutts = Mutt.all
    @photos = Photo.where(profile: true)
    if @photos.empty?
      flash[:error] = "No mutt photos!"
    else
      mutts = {}
      mutts["slides"] = @photos.map do |pic|
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

        { photoId: pic.id, photoUrl: pic.image.url(:large), muttId: mutt.id, muttName: mutt.name, muttGuesses: guessed_breeds }
      end
    end

    respond_to do |format|
      format.html
      format.js
      format.json { render json: mutts }
    end
  end

  def show
  end

  def create
    @mutt = Mutt.new(mutt_params)
    @mutt.owner_id = current_user.id
    if @mutt.save
      redirect_to(@mutt)
    else
      flash[:error] = "Mutt could not be saved"
      redirect_to new_mutt_path
    end
  end

  private

  def set_mutt
    @mutt = Mutt.find(params[:id])
  end

  def mutt_params
    params.require(:mutt).permit(:name)
  end
end