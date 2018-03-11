class PhotosController < ApplicationController

  def new
    @mutt = Mutt.find(params[:mutt_id])
    @photo = @mutt.photos.build
  end

  def create
    @mutt = Mutt.find(params[:mutt_id])
    p params
    @photo = @mutt.photos.build({mutt_id: params[:mutt_id], image: params[:image], profile: params[:profile]})

    respond_to do |format|
      if @photo.save
        flash[:success] = "New photo added!"
        if @photo.profile
          @mutt.photos.each do |photo|
            if (photo.id != @photo.id)
              photo.profile = false
              photo.save
            end
          end

        elsif @mutt.photos.where(profile: true).empty?
          first_mutt = @mutt.photos.first
          first_mutt.profile = true
          first_mutt.save
        end

        # format.html redirect_to "users/#{@mutt.owner_id}"
        format.json { render json: @photo }
      else
        flash[:error] = "Photo could not be uploaded"
        # format.html render 'new'
        format.json { render json: @photo.errors }
      end
    end
  end

  private

  def photo_params
    params.require(:photo).permit(:image, :profile)
  end
end