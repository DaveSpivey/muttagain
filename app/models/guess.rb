class Guess < ActiveRecord::Base
  belongs_to :user
  belongs_to :mutt
end