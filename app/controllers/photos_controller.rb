class PhotosController < ApplicationController

  def new
    @mutt = Mutt.find(params[:mutt_id])
    @photo = @mutt.photos.build
  end

  def create
    @mutt = Mutt.find(params[:mutt_id])
    @photo = @mutt.photos.build(photo_params)
    if @photo.save
      flash[:success] = "New photo added!"
      if @photo.profile
        @mutt.photos.except(id: @photo.id).each do |photo|
          photo.profile = false
        end
      elsif @mutt.photos.where(profile: true).empty?
        @mutt.photos.first.profile = true
      end
      redirect_to root_path
    else
      flash[:error] = "Photo could not be uploaded"
      render 'new'
    end
  end

  private

  def photo_params
    params.require(:photo).permit(:image, :profile)
  end
end