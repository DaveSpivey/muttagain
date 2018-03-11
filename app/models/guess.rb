class Guess < ActiveRecord::Base
  belongs_to :mutt
  belongs_to :breed
end