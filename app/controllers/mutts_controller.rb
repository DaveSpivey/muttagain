class MuttsController < ApplicationController

  before_action :set_mutt, only: [:show, :edit, :update, :destroy]

  def index
    @mutts = Mutt.all
    @photos = Photo.where(profile: true)
  end

  def show
  end

  def create
    @mutt = Mutt.new(mutt_params)
    @mutt.owner_id = current_user.id
    if @mutt.save
      render mutt_path(@mutt)
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