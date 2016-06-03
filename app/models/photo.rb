class Photo < ActiveRecord::Base
  belongs_to :mutt

  has_attached_file :image
end