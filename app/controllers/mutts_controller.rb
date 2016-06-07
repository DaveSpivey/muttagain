class MuttsController < ApplicationController

  before_action :set_mutt, only: [:show, :edit, :update, :destroy]

  def index
    @photos = Photo.where(profile: true)
    if @photos.empty?
      flash[:error] = "No mutt photos!"
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