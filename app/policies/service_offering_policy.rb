class ServiceOfferingPolicy < ApplicationPolicy

	def index?
		true
	end

	def show?
		true
	end

	def create?
		organizer_or_admin?
	end

	def update?
		organizer?
	end

	def destroy?
		organizer_or_admin?
	end

	def get_things?
		true
	end

  class Scope < Scope

	  def user_roles members_only=true, allow_admin=true
		  include_admin=allow_admin && @user && @user.is_admin?
		  member_join = members_only && !include_admin ? 'join' : 'left join'
		  joins_clause=["#{member_join} Roles r on r.mname='Thing'",
		                "r.mid=Things.id",
		                "r.user_id #{user_criteria}"].join(' and ')
		  scope.select('Things.*, r.role_name')
			  .joins(joins_clause)
			  .tap do |s|
				  if members_only
					  s.where("r.role_name"=>[Role::ORGANIZER, Role::MEMBER])
				  end
			  end
	  end

	   def resolve
		  user_roles
	   end
  end
end
