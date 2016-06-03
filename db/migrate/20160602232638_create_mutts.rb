class CreateMutts < ActiveRecord::Migration
  def change
    create_table :mutts do |t|
      t.string :name
      t.references :owner, references: :users

      t.timestamps null: false
    end
  end
end
