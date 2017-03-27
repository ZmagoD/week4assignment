class CreateServiceOfferings < ActiveRecord::Migration
  def change
    create_table :service_offerings do |t|
      t.references :thing, index: true, foreign_key: true
      t.string :name
      t.text :description
      t.integer :creator_id, {null:false}
      t.timestamps null: false
    end
  end
end
