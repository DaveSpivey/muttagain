class PhotosController < ApplicationController

  before_action :set_mutt, only: [:index, :new, :create, :edit, :update, :destroy]

  def index
    @photos = @mutt.photos.map do |pic|
      {id: pic.id, mutt_id: pic.mutt_id, profile: pic.profile, url: pic.image.url(:medium)}
    end

    respond_to do |format|
      format.json { render json: @photos }
    end
  end

  def new
    @photo = @mutt.photos.build
  end

  def create
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

        format.json { render json: get_updated_photos }
      else
        flash[:error] = "Photo could not be uploaded"
        format.json { render json: @photo.errors }
      end
    end
  end

  def update
    current_photo = @mutt.photos.find(params[:id])

    @mutt.photos.each do |photo|
      if (photo.id != current_photo.id)
        photo.profile = false
        photo.save
      end
    end

    current_photo.profile = true
    current_photo.save

    mutt_photos = get_updated_photos

    respond_to do |format|
      format.json { render json: mutt_photos }
    end
  end

  def destroy
    @photo = @mutt.photos.find(params[:id])
    if @photo.profile == true && @mutt.photos.length > 1
      @mutt.photos.first.profile = true
      @mutt.photos.first.save
    end
    @photo.destroy

    mutt_photos = get_updated_photos

    respond_to do |format|
      format.json { render json: mutt_photos }
    end
  end

  private

  def set_mutt
    @mutt = Mutt.find(params[:mutt_id])
  end

  def photo_params
    params.require(:photo).permit(:image, :profile)
  end

  def get_updated_photos
    Photo.where(mutt_id: params[:mutt_id]).map do |pic|
      {
        id: pic.id, 
        mutt_id: pic.mutt_id, 
        profile: pic.profile, 
        smallUrl: pic.image.url(:small), 
        mediumUrl: pic.image.url(:medium), 
        largeUrl: pic.image.url(:large)
      }
    end
  end
end